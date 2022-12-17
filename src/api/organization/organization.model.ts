import {Schema, model, Document, ObjectId} from 'mongoose';

export interface IOrganization {
  name: string;
}

const organizationSchema = new Schema<IOrganization>({
  name: {type: String, unique: true, required: true},
});

const Organization = model<IOrganization>('Organization', organizationSchema);
export default Organization;

export type OrganizationDocument = (Document<unknown, any, IOrganization> & IOrganization & { _id: ObjectId });
