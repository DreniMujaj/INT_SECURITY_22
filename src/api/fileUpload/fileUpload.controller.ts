import {NextFunction, Request, Response} from 'express';

import BadRequestError from '../../error/@types/badRequestError';
import Controller from '../controller';
import {CreateFileDTO} from './dto/request/createFile.dto';
import {Express} from 'express';
import {FileService} from './file.service';
import {HttpMethod} from '../../util/httpMethod';
import {HttpStatusCode} from '../../util/httpStatusCode';
import path from 'path';

/**
 * File Controller
 */
class FileController extends Controller {
  /**
   * Initialize File Routes
   */
  initializeRoutes(): void {
    this.createRoute(HttpMethod.POST, '/', {validation: CreateFileDTO}, this.uploadFile);
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
      const file = request.file;
      const res = await FileService.uploadFile(body, file);
      response.status(HttpStatusCode.CREATED).json(res);
    } catch (e) {
      next(e);
    }
  }

  /**
   * validateDocument
   *
   * @param body body
   * @param file file
   */
  public static async validateDocument(body: CreateFileDTO, file: Express.Multer.File): Promise<void> {
    const extension = path.extname(file.originalname);
    if (!['.pdf', '.docx', '.xlsx', '.pptx'].includes(extension)) {
      throw new BadRequestError(`Invalid format ${extension}`);
    }
  }
}

export default FileController;