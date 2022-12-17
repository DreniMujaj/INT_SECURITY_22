import {NextFunction, Request, Response} from 'express';

import Controller from '../controller';
import {CreateOrganizationDto} from './dto/request/createOrganization.dto';
import {HttpMethod} from '../../util/httpMethod';
import {HttpStatusCode} from '../../util/httpStatusCode';
import OrganizationService from './organization.service';
import {Role} from '../../auth/@types/roles';
import {UpdateOrganizationDto} from './dto/request/updateOrganization.dto';

/**
 * Organization Controller
 */
class OrganizationController extends Controller {
  /**
   * Initialize Test Routes
   */
  initializeRoutes(): void {
    this.createRoute(HttpMethod.GET, '/', {}, this.getAllOrganizations);
  }

  /**
   * getAllUsers
   *
   * @param request Express Request
   * @param response Express Response
   */
  private async getAllOrganizations(request: Request, response: Response): Promise<void> {
    response.json({});
  }
}

export default OrganizationController;