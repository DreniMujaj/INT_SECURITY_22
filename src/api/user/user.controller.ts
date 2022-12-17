import {NextFunction, Request, Response} from 'express';

import Controller from '../controller';
import {CreateUserDto} from './dto/request/createUser.dto';
import {HttpMethod} from '../../util/httpMethod';
import {HttpStatusCode} from '../../util/httpStatusCode';
import UserService from './user.service';

/**
 * Test Controller
 */
class UserController extends Controller {
  /**
   * Initialize Test Routes
   */
  initializeRoutes(): void {
    this.createRoute(HttpMethod.GET, '/me', {}, this.getCurrentUser);
  }


  /**
   * getCurrentUser
   *
   * @param request Express Request
   * @param response Express Response
   */
  private async getCurrentUser(request: Request, response: Response): Promise<void> {
    const user = await UserService.getMyUser(request.auth!);
    response.json(user);
  }
}

export default UserController;
