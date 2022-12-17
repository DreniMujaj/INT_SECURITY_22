import {HttpStatusCode} from '../../util/httpStatusCode';
import BaseError from './baseError';

/**
 * NotFoundError Class
 */
export default class NotFoundError extends BaseError {
  /**
   * NotFoundError
   *
   * @param description Error Description
   * @param name Error Name
   */
  constructor(description: string, name: string = 'Not Found') {
    super(name, HttpStatusCode.NOT_FOUND, description, true);
  }
}
