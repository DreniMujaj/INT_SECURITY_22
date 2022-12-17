import {HttpStatusCode} from '../../util/httpStatusCode';
import BaseError from './baseError';

/**
 * NotYetImplementedError Class
 */
export default class NotYetImplementedError extends BaseError {
  /**
   * NotYetImplementedError
   *
   * @param description Error Description
   * @param name Error Name
   */
  constructor(description: string, name: string = 'Not Yet Implemented') {
    super(name, HttpStatusCode.INTERNAL_SERVER_ERROR, description, false);
  }
}
