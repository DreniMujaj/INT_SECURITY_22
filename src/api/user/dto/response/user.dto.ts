import {Role} from '../../../../auth/@types/roles';

/**
 * User DTO Class
 */
export default class UserDto {
  /**
   * UserDto
   *
   * @param id User Id
   * @param email User Mail
   * @param roles User Roles
   * @param active Is user deleted
   * @param confirmed confirmed
   * @param organization User Organization
   */
  constructor(
    public id: string,
    public email: string,
    public roles: Role[],
    public active: boolean,
    public confirmed: boolean,
    public organization?: string,
  ) { }
}
