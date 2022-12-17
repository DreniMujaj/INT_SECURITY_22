import {HttpStatusCode} from '../../util/httpStatusCode';
import BaseError from './baseError';

/**
 * UnauthorizedError Class
 */
export default class UnauthorizedError extends BaseError {
  /**
   * UnauthorizedError
   *
   * @param description Error Description
   * @param name Error Name
   */
  constructor(description: string, name: string = 'Unauthorized') {
    super(name, HttpStatusCode.UNAUTHORIZED, description, true);
  }
}
