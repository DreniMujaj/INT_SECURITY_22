import {NextFunction, Request, Response} from 'express';

import BadRequestError from '../../src/error/@types/badRequestError';
import {GenerateToken} from '../../src/auth/generateToken';
import NotFoundError from '../../src/error/@types/notFoundError';
import PassportLocal from 'passport-local';
import {Role} from '../../src/auth/@types/roles';
import {Types} from 'mongoose';
import UnauthorizedError from '../../src/error/@types/unauthorizedError';
import User from '../../src/api/user/user.model';
import {createMockUser} from './mockObjects';
import passport from 'passport';

/**
 * mockLogin
 *
 * @param roles Desired mocked roles
 * @param organization organization
 */
export async function mockLogin(roles: Role[], organization?: Types.ObjectId): Promise<string> {
  let token: string;
  const user = await createMockUser('Pa$$w0rd', roles, organization);
  return await new Promise((resolve, reject) => {
    loginMiddlewareMock({body: {localUser: {email: user.email, password: 'Pa$$w0rd', confirmationCode: user.confirmationCode}}} as Request, {
      json: (body: {token: string}) => {
        token = body.token;
        resolve(token);
      }} as Response, () => {});
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
export async function loginMiddlewareMock(request: Request, response: Response, next: NextFunction): Promise<any> {
  if (request.body.localUser) {
    request.body = request.body.localUser;
    return passport.authenticate(loginStrategyMock(), (err, user) => {
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
  } else {
    next(new BadRequestError('Invalid Input'));
  }
}

/**
 * loginStrategy
 *
 * @returns Login Strategy
 */
export function loginStrategyMock(): PassportLocal.Strategy {
  return new PassportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email: string, password: string, done) => {
    const user = await User.findOne({email});
    if (!user) {
      return done(new NotFoundError('User not Found'));
    }

    const validate = await user.isValidPassword(password);

    if (!validate) {
      return done(new UnauthorizedError('Password does not match'));
    }
    return done(undefined, user);
  });
}

/**
 * mockLoginWithUserId
 *
 * @param roles Desired mocked roles
 * @param organization organization
 */
export async function mockLoginWithUserId(roles: Role[], organization?: Types.ObjectId): Promise<{token: string; userId: string}> {
  let token: string;
  const user = await createMockUser('Pa$$w0rd', roles, organization);
  return new Promise((resolve, reject) => {
    loginMiddlewareMock({body: {localUser: {email: user.email, password: 'Pa$$w0rd', confirmationCode: user.confirmationCode}}} as Request, {
      json: (body: {token: string}) => {
        token = body.token;
        resolve({token: token, userId: user.id});
      }} as Response, () => {});
  });
}
