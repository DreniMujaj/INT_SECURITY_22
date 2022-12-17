import BadRequestError from '../error/@types/badRequestError';
import Environment from '../env';
import {Role} from './@types/roles';
import {sign} from 'jsonwebtoken';

/**
 *
 */
export class GenerateToken {
  /**
   * generateTransactionAccessToken
   *
   * @param tokenId tokenId
   * @param organization organization
   * @param recipient recipient
   * @param expiryDate expiryDate
   * @param transactionId transactionId
   * @param formId formId
   * @returns access token
   */
  public static async generateTransactionAccessToken(tokenId: string, organization: string, recipient: string, expiryDate: Date, transactionId: string, formId: string): Promise<string> {
    const currentDate = new Date();
    const expiry = Math.floor((expiryDate.getTime() - currentDate.getTime())/1000);

    if (expiry <= 0) {
      throw new BadRequestError('Expiry date must be in the future');
    }
    const token = sign({
      tokenId: tokenId,
      aud: `${Environment.AUTH_AUDIENCE()}`,
      iss: `${Environment.AUTH_ISSUER()}`,
      organization: organization,
      recipient: recipient,
      transactionId: transactionId,
      formId: formId,
    }, `${Environment.AUTH_SECRET()}`, {expiresIn: expiry});
    return token;
  }

  /**
   * generateUserAccessToken
   *
   * @param userId userId
   * @param userRoles userRoles
   * @returns access token
   */
  public static async generateUserAccessToken(userId: string, userRoles:Role[]): Promise<string> {
    const currentDate = new Date();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours()+ Number(Environment.AUTH_TOKEN_EXP()));
    const expiry = Math.floor((expiryDate.getTime() - currentDate.getTime())/1000);
    const token = sign({
      sub: userId,
      aud: `${Environment.AUTH_AUDIENCE()}`,
      iss: `${Environment.AUTH_ISSUER()}`,
      roles: userRoles,
    }, `${Environment.AUTH_SECRET()}`, {expiresIn: expiry});
    return token;
  }

  /**
   * generateUserAccessToken
   *
   * @param email email
   * @returns access token
   */
  public static async generateConfirmationCode(email: string): Promise<string> {
    const currentDate = new Date();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours()+ Number(Environment.AUTH_TOKEN_EXP()));
    const expiry = Math.floor((expiryDate.getTime() - currentDate.getTime())/1000);
    const token = sign({
      email: email,
    }, `${Environment.AUTH_SECRET()}`, {expiresIn: expiry});
    return token;
  }
}
