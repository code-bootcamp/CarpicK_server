import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import 'dotenv/config';

interface IImageFile {
  files: FileUpload[];
}

@Injectable()
export class ImageFileService {
  async upload({ files }: IImageFile) {
    const waitedFiles = await Promise.all(files);
    const storage = new Storage({
      projectId: process.env.STORAGE_PROJECT_ID,
      keyFilename: process.env.STORAGE_KEY_FILENAME,
    }).bucket(process.env.STORAGE_BUCKET);
    const url = await Promise.all(
      waitedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          file
            .createReadStream()
            .pipe(storage.file(file.filename).createWriteStream())
            .on('finish', () =>
              resolve(`${process.env.STORAGE_BUCKET}/${file.filename}`),
            )
            .on('error', () => reject());
        });
      }),
    );
    return url;
  }
}
