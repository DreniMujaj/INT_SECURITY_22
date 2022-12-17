import {NextFunction, Request, RequestHandler, Response} from 'express';

import BadRequestError from '../error/@types/badRequestError';

/**
 *
 */
export class HeaderValidation {
  /**
   * contentTypeCheckMiddleware
   *
   * @param req Express Request
   * @param res Express Response
   * @param next Express Next Function
   */
  public static contentTypeCheckMiddleware(req: Request, res: Response, next: NextFunction): RequestHandler | void {
    try {
      if (['PATCH', 'POST', 'PUT'].includes(req.method) && !req.is('application/json')) {
        throw new BadRequestError('content-type must be application/json');
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}
