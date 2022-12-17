import 'reflect-metadata';

import {NextFunction, Request, RequestHandler, Response} from 'express';
import {ValidationError, validate} from 'class-validator';

import BadRequestError from '../error/@types/badRequestError';
import {plainToInstance} from 'class-transformer';
import {sanitize} from 'class-sanitizer';

/**
 * Validator Class
 */
export default class Validator {
  /**
   * dtoValidationMiddleware
   *
   * @param type Dto Object Type to be validated against
   * @returns Express Middleware
   */
  public static dtoValidationMiddleware(type: any): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const dtoObj = plainToInstance(type, req.body);
      validate(dtoObj, {
        skipMissingProperties: false,
        forbidNonWhitelisted: true,
        validationError: {
          target: true,
          value: true,
        },
      }).then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const dtoErrors = this.validationErrorMapper(errors);
          next(new BadRequestError('Bad Request', dtoErrors));
        } else {
          // sanitize the object and call the next middleware
          sanitize(dtoObj);
          req.body = dtoObj;
          next();
        }
      });
    };
  }

  /**
   * validationErrorMapper
   *
   * @param errors List of ValidationErrors
   * @returns Validation Error String
   */
  private static validationErrorMapper(errors: ValidationError[]): string {
    const result: string[] = [];
    for (const error of errors) {
      if (error.children && error.children.length > 0) {
        result.push(`${error.property}: (${this.validationErrorMapper(error.children)})`);
      } else {
        result.push((Object as any).values(error.constraints));
      }
    }
    return result.join(', ');
  }
}
