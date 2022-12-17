import {NextFunction, Request, Response} from 'express';

import BaseError from './@types/baseError';
import {HttpStatusCode} from '../util/httpStatusCode';
import Logger from '../logging/logger';

/**
 * Class representing the Error Handler
 */
export default class ErrorHandler {
  /**
   * logErrorMiddleware
   *
   * @param error Any thrown error
   * @param request Express Request
   * @param response Express Response
   * @param next Call to next Middleware
   */
  static errorMiddleware(error: Error, request: Request, response: Response, next: NextFunction): void {
    if (!(error instanceof BaseError && error.isUserError)) {
      Logger.error(error.stack);
    }
    ErrorHandler.returnError(error, request, response, next);
  }

  /**
   * returnError
   *
   * @param error Any thrown error
   * @param request Express Request
   * @param response Express Response
   * @param next Call to next Middleware
   */
  static returnError(error: Error | BaseError, request: Request, response: Response, next: NextFunction): void {
    if (error instanceof BaseError) {
      response.status(error.statusCode).send(error.message);
    } else {
      response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}
