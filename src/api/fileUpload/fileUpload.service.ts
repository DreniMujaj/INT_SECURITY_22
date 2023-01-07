import * as ftp from 'basic-ftp';

import BadRequestError from '../../error/@types/badRequestError';
import {CreateFileDTO} from './dto/request/createFile.dto';
import Environment from '../../env';
import {Express} from 'express';
import {FileDTO} from './dto/response/file.dto';
import FileModel from './fileUpload.model';
import Logger from '../../logging/logger';
import path from 'path';

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
    await FileService.validateDocument(createFileDto, file);
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

  /**
   * validateDocument
   *
   * @param body body
   * @param file file
   */
  public static async validateDocument(body: CreateFileDTO, file: Express.Multer.File): Promise<void> {
    const extension = path.extname(file.originalname);
    if (!['.pdf', '.docx', '.docx', '.xlsx', '.pptx'].includes(extension)) {
      throw new BadRequestError(`Invalid format ${extension}`);
    }
  }
}
