import Authorization from '../../auth/authorization';
import Controller from '../controller';
import {HttpMethod} from '../../util/httpMethod';
import {LoginUserDto} from './dto/request/loginUser.dto';

/**
 * Test Controller
 */
class AuthController extends Controller {
  /**
   * Initialize Test Routes
   */
  initializeRoutes(): void {
    this.createRoute(HttpMethod.POST, '/login', {validation: LoginUserDto}, Authorization.loginMiddleware);
  }
}

export default AuthController;
