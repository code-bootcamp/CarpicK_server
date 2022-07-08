import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

const PROJECT_ID = process.env.PROJECT_ID;
const JOSON_KEY = process.env.JOSON_KEY;

@Injectable()
export class FileService {
  async upload({ files }) {
    const waitedFiles = await Promise.all(files);
    const storage = new Storage({
      projectId: PROJECT_ID,
      keyFilename: JOSON_KEY,
    }).bucket('k-bucket01');
    const result = await Promise.all(
      waitedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          file
            .createReadStream()
            .pipe(storage.file(file.filename).createWriteStream())
            .on('finish', () => resolve(`k-bucket01/${file.filename}`))
            .on('error', () => reject());
        });
      }),
    );
    return result;
  }
}
