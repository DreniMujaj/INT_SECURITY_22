import Auth from '../../auth/@types/jwt';
import BadRequestError from '../../error/@types/badRequestError';
import NotFoundError from '../../error/@types/notFoundError';
import {OrganizationDocument} from '../organization/organization.model';
import User from './user.model';
import UserDto from './dto/response/user.dto';

/**
 * User Services
 */
export default class UserService {
  /**
   * getMyUser
   *
   * @param auth auth
   * @returns User DTO
   */
  public static async getMyUser(auth: Auth): Promise<UserDto> {
    const userId = auth.sub;
    const dbUser = await User.findById(userId).populate<{organization: OrganizationDocument | undefined}>('organization');
    const user =new UserDto(dbUser!.id, dbUser!.email, dbUser!.roles, dbUser!.active!, dbUser!.confirmed!, dbUser!.organization?.name);
    return user;
  }

  /**
   * verifyUser
   *
   * @param confirmationCode confirmationCode
   */
  public static async verifyUser(confirmationCode: string): Promise<void> {
    const dbUser = await User.findOne({confirmationCode: confirmationCode});
    if (!dbUser) {
      throw new NotFoundError('user not found');
    }

    dbUser.confirmed = true;

    await dbUser.save();
  }
}
