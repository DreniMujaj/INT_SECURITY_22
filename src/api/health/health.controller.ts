import {NextFunction, Request, Response} from 'express';

import Controller from '../controller';
import {HttpMethod} from '../../util/httpMethod';

/**
 * Health Controller
 */
class HealthController extends Controller {
  /**
   * Initialize Health Routes
   */
  initializeRoutes(): void {
    this.createRoute(HttpMethod.GET, '/', {}, this.getHealth);
  }

  /**
   * getHealth
   *
   * @param request Express Request
   * @param response Express Response
   * @param next NextFunction
   */
  private async getHealth(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.send();
    } catch (e) {
      next(e);
    }
  }
}

export default HealthController;
