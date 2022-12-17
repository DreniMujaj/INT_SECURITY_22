import {HttpStatusCode} from '../../util/httpStatusCode';
import BaseError from './baseError';

/**
 * BadRequestError Class
 */
export default class BadRequestError extends BaseError {
  /**
   * BadRequestError
   *
   * @param description Error Description
   * @param name Error Name
   */
  constructor(description: string, name: string = 'Bad Request') {
    super(name, HttpStatusCode.BAD_REQUEST, description, true);
  }
}
