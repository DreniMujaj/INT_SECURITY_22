import {HttpStatusCode} from '../../util/httpStatusCode';

/**
 * BaseError Class
 */
export default class BaseError extends Error {
  /**
   * BaseError
   *
   * @param name Error Name
   * @param statusCode Error Status Code
   * @param description Error Description
   * @param isUserError is the Error caused by user input
   */
  constructor(name: string, public statusCode: HttpStatusCode, description: string, public isUserError: boolean) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    Error.captureStackTrace(this);
  }
}
