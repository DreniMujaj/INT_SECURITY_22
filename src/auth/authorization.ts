import {NextFunction, Request, RequestHandler, Response} from 'express';
import PassportJwt, {ExtractJwt} from 'passport-jwt';

import Auth from './@types/jwt';
import AzureUser from './@types/azureUser';
import BadRequestError from '../error/@types/badRequestError';
import Environment from '../env';
import ForbiddenError from '../error/@types/forbiddenError';
import {GenerateToken} from './generateToken';
import NotFoundError from '../error/@types/notFoundError';
import PassportLocal from 'passport-local';
import {Role} from './@types/roles';
import {UNSECURED_PATHS} from '../api/auth/data/auth.config';
import UnauthorizedError from '../error/@types/unauthorizedError';
import User from '../api/user/user.model';
import {UserOrigin} from './@types/origin';
import axios from 'axios';
import passport from 'passport';

/**
 * Extend the Express Request definition including an auth model
 */
declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
      interface Request {
          auth?: Auth;
      }
  }
}

/**
 * Authorization Handler
 */
export default class Authorization {
  /**
   * loginStrategy
   *
   * @returns Login Strategy
   */
  private static loginStrategy(): PassportLocal.Strategy {
    return new PassportLocal.Strategy({
      usernameField: 'email',
      passwordField: 'password',
    }, async (email: string, password: string, done) => {
      const user = await User.findOne({email});
      if (!user) {
        return done(new NotFoundError('User not Found'));
      }

      // if (!user.active || !user.confirmed) {
      //   return done(new BadRequestError('User is not active or not confirmed, please verify your email'));
      // }

      const validate = await user.isValidPassword(password);

      if (!validate) {
        return done(new UnauthorizedError('Password does not match'));
      }
      return done(undefined, user);
    });
  }
  /**
   * validationStrategy
   *
   * @returns Validation Strategy
   */
  private static validationStrategy(): PassportJwt.Strategy {
    return new PassportJwt.Strategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${Environment.AUTH_SECRET()}`,
      audience: `${Environment.AUTH_AUDIENCE()}`,
      issuer: `${Environment.AUTH_ISSUER()}`,
    }, async (jwtToken, done) => {
      if (jwtToken.sub) {
        const user = await User.findOne({_id: jwtToken.sub});
        if (!user) {
          return done(new UnauthorizedError('This user no longer exists'), false);
        } else {
          return done(undefined, user, jwtToken);
        }
      }
    });
  }

  /**
   * loginMiddleware
   * checks if POST req is made with email and password or with azureAccessToken in body
   *
   * @param request Express Request
   * @param response Express Response
   * @param next Express Next Function
   * @returns Express Middleware
   */
  public static async loginMiddleware(request: Request, response: Response, next: NextFunction): Promise<any> {
    if (request.body.localUser) {
      request.body = request.body.localUser;
      return passport.authenticate(Authorization.loginStrategy(), (err, user) => {
        if (err) {
          return next(err);
        }
        request.login(user, {session: false}, async (error) => {
          if (error) {
            return next(error);
          }
          const token = await GenerateToken.generateUserAccessToken(user.id, user.roles);
          return response.json({token});
        });
      })(request, response, next);
    } else if (request.body.tokenUser) {
      // Tested with postman
      try {
        const azureUser = await Authorization.azureTokenValidation(request, response);
        let dbUser = await User.findOne({email: azureUser.email, origin: UserOrigin.azure});
        if (!dbUser) {
          dbUser = await User.create({origin: UserOrigin.azure, email: azureUser.email});
        }
        const token = await GenerateToken.generateUserAccessToken(dbUser.id, dbUser.roles ?? []);
        return response.json({token});
      } catch (err) {
        next(err);
      }
    } else {
      next(new BadRequestError('Invalid Input'));
    }
  }

  /**
   * authenticationMiddleware
   *
   * @param req Express Request
   * @param res Express Response
   * @param next Express Next Function
   * @returns Express Middleware
   */
  public static authenticationMiddleware(req: Request, res: Response, next: NextFunction): RequestHandler | void {
    if (UNSECURED_PATHS.includes(req.originalUrl)) {
      return next();
    }
    return passport.authenticate(Authorization.validationStrategy(), (err, user, token) => {
      if (err) {
        return next(new UnauthorizedError(err));
      }
      if (!user) {
        return next(new UnauthorizedError(err));
      } else {
        req.auth = token;
        return next();
      }
    })(req, res, next);
  }

  /**
   * authorizationMiddleware
   *
   * @param roles Access Roles
   * @returns Role check middleware
   */
  public static authorizationMiddleware(roles: Role[]): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.auth) {
        return next(new UnauthorizedError('Unauthorized'));
      }

      for (const role of roles) {
        if (req.auth.roles && req.auth.roles.includes(role)) {
          return next();
        }
      }
      return next(new ForbiddenError('Missing Access Rights'));
    };
  }

  /**
   * azureTokenValidation
   *
   * @param req Express request
   * @param res Express response
   */
  private static async azureTokenValidation(req: Request, res: Response): Promise<AzureUser> {
    const azureToken = req.body.tokenUser.accessToken;
    const config = {
      method: 'get',
      url: 'https://graph.microsoft.com/oidc/userinfo',
      headers: {'Authorization': `Bearer ${azureToken}`},
    };
    try {
      const response = await axios(config);
      const user: AzureUser = response.data;
      return user;
    } catch (err) {
      throw new UnauthorizedError('Unauthorized');
    }
  }
}
