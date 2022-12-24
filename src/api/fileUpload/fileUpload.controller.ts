import {NextFunction, Request, Response} from 'express';

import BadRequestError from '../../error/@types/badRequestError';
import Controller from '../controller';
import {Express} from 'express';
import {HttpMethod} from '../../util/httpMethod';
import {HttpStatusCode} from '../../util/httpStatusCode';
import path from 'path';

/**
 * FileController
 *
 */
class FileController extends Controller {
  /**
   * initializeRoutes
   *
   */
  initializeRoutes(): void {
    this.createRoute(HttpMethod.POST, '/', {}, this.uploadFile);
  }
  /**
   * uploadFile
   *
   * @param request Express Request
   * @param response Express Response
   * @param next NextFunction
   */
  private async uploadFile(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const body = request.body;
      response.status(HttpStatusCode.CREATED).json({});
    } catch (e) {
      next(e);
    }
  }
}

export default FileController;
