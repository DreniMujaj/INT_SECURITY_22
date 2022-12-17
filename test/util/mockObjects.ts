import User, {IUserDocument} from '../../src/api/user/user.model';

import {GenerateToken} from '../../src/auth/generateToken';
import {Role} from '../../src/auth/@types/roles';
import {Types} from 'mongoose';
import {UserOrigin} from '../../src/auth/@types/origin';
import {randomUUID} from 'crypto';

/**
 * createMockUser
 *
 * @param password Desired mocked Password
 * @param roles Desired mocked roles
 * @param organization organization
 */
export async function createMockUser(password: string = 'Pa$$w0rd', roles: Role[] = [Role.ADMIN], organization?: Types.ObjectId): Promise<IUserDocument&{_id: any}> {
  const email = `${randomUUID()}@example.com`;
  const confirmationCode = await GenerateToken.generateConfirmationCode(email);
  const user = {
    origin: UserOrigin.local,
    email: email,
    password,
    roles,
    organization: organization,
    confirmationCode: confirmationCode ?? randomUUID(),
  };
  return await User.create(user);
}

