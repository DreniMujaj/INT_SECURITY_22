import * as ftp from 'basic-ftp';

import BadRequestError from '../../error/@types/badRequestError';
import {CreateFileDTO} from './dto/request/createFile.dto';
import Environment from '../../env';
import {Express} from 'express';
import {FileDTO} from './dto/response/file.dto';
import FileModel from './file.model';
import Logger from '../../logging/logger';

/**
 * FileService
 *
 */
export class FileService {
  /**
   * uploadFile
   *
   * @param createFileDto createFileDto
   * @param file file
   */
  public static async uploadFile(createFileDto: CreateFileDTO, file: Express.Multer.File | undefined): Promise<FileDTO> {
    if (!file) {
      throw new BadRequestError('file not found');
    }
    const client = new ftp.Client();
    client.ftp.verbose = true;
    await client.access({
      host: Environment.IP_ADDRESS(),
      user: Environment.FTP_USER(),
      password: '',
      port: Environment.FTP_PORT(),
      secure: false,
    });
    Logger.warn(await client.list());
    await client.uploadFrom(`.//temp//${file.filename}`, `/${file.originalname}`);

    const dbFile = await FileModel.create({userId: createFileDto.userId, originalName: file.originalname});
    client.close();
    return new FileDTO(dbFile.userId.toString(), dbFile.originalName);
  }
}
