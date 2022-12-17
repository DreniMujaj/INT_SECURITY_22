import {Role} from './roles';

export default interface Auth {
  sub: string;
  aud: string;
  iss: string;
  roles: Role[];
  iat: number;
  tokenId: string;
  organization: string;
  recipient: string;
  transactionId: string;
  formId: string;
  exp: number;
}
