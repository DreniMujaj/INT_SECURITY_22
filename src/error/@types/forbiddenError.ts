import {HttpStatusCode} from '../../util/httpStatusCode';
import BaseError from './baseError';

/**
 * ForbiddenError Class
 */
export default class ForbiddenError extends BaseError {
  /**
   * ForbiddenError
   *
   * @param description Error Description
   * @param name Error Name
   */
  constructor(description: string, name: string = 'Forbidden') {
    super(name, HttpStatusCode.FORBIDDEN, description, true);
  }
}
