import {Document, Model, ObjectId, Schema, model} from 'mongoose';
import {compare, hash} from 'bcrypt';

import {Role} from '../../auth/@types/roles';
import {UserOrigin} from '../../auth/@types/origin';

export interface IUser {
  origin: UserOrigin;
  email: string;
  password: string;
  roles: Role[];
  organization?: ObjectId;
  active?: boolean;
  confirmed?: boolean;
  confirmationCode?: string;
}

export interface IUserDocument extends IUser, Document {
  isValidPassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument>({
  origin: {type: String, enum: Object.values(UserOrigin), required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required:

  /**
   * conditionalRequired
   *
   * @param this this
   * @returns boolean
   */
    function(this: IUserDocument): boolean {
      return this.origin === UserOrigin.local;
    }},

  roles: [{type: String, enum: Object.values(Role), required: true}],
  organization: {type: Schema.Types.ObjectId, ref: 'Organization', required: false},
  active: {type: Boolean, required: false, default: true},
  confirmed: {type: Boolean, required: false, default: false},
  confirmationCode: {type: String, required: false},
});

userSchema.pre<IUser>('save', async function(next) {
  // eslint-disable-next-line no-invalid-this
  const user = this;
  if (user.origin == UserOrigin.local) {
    user.password = await hash(user.password, 10);
  }
  next();
});

/**
 * isValidPassword
 *
 * @param password user password
 * @returns is password valid
 */
userSchema.methods.isValidPassword = async function(password: string): Promise<boolean> {
  const user = this;
  return await compare(password, user.password);
};

const User = model<IUserDocument>('User', userSchema);
export default User;
