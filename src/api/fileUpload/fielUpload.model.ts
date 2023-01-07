import {Document, ObjectId, Schema, Types, model} from 'mongoose';

export interface IFile {
originalName: string;
userId: Types.ObjectId;
}

const invoiceSchema = new Schema<IFile>({
  originalName: {type: String, required: true},
  userId: {type: Schema.Types.ObjectId, ref: 'user', required: true},
});

const FileModel = model<IFile>('File', invoiceSchema);
export default FileModel;

export type FileDocument = (Document<unknown, any, IFile> & IFile & { _id: ObjectId });
