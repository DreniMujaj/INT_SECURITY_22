import {RequestHandler, Router} from 'express';

import {HttpMethod} from '../util/httpMethod';
import Validator from '../validating/validator';

/**
 * Abstract Controller
 */
export default abstract class Controller {
  // eslint-disable-next-line new-cap
  public router = Router();

  /**
   * Create new Controller
   *
   * @param path Path of the Router
   */
  constructor(public readonly path: string) {
    this.initializeRoutes();
  }

  /**
   * createRoute
   *
   * @param method Http Method
   * @param path Local Path of the route
   * @param middlewares Roles, Scope, and body validation required to access route
   * @param middlewares.validation Body validation required to access route
   * @param handlers Additional Middlewares
   */
  protected createRoute(method: HttpMethod, path: string, middlewares: {validation?: any}, ...handlers: Array<RequestHandler>): void {
    switch (method) {
      case HttpMethod.GET:
        if (middlewares.validation) {
          throw new Error('Trying to register body validator for a GET request');
        }
        this.router.get(`${this.path}${path}`, ...handlers);
        break;
      case HttpMethod.POST:
        if (middlewares.validation) {
          this.router.post(`${this.path}${path}`, Validator.dtoValidationMiddleware(middlewares.validation), ...handlers);
        } else {
          this.router.post(`${this.path}${path}`, ...handlers);
        }
        break;
      case HttpMethod.PUT:
        if (middlewares.validation) {
          this.router.put(`${this.path}${path}`, Validator.dtoValidationMiddleware(middlewares.validation), ...handlers);
        } else {
          this.router.put(`${this.path}${path}`, ...handlers);
        }
        break;
      case HttpMethod.DELETE:
        if (middlewares.validation) {
          this.router.delete(`${this.path}${path}`, Validator.dtoValidationMiddleware(middlewares.validation), ...handlers);
        } else {
          this.router.delete(`${this.path}${path}`, ...handlers);
        }
        break;
      default:
        break;
    }
  }

  /**
   * Initialize Routes
   */
  abstract initializeRoutes(): void;
}
