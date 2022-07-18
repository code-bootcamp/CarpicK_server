import { Injectable } from '@nestjs/common';
import Request from 'sync-request';
import * as Crypto from 'crypto';
import * as NodeRSA from 'node-rsa';

@Injectable()
export class LicenTruthService {
  aesEncrypt(
    key: Buffer | Crypto.CipherKey,
    iv: Buffer | Crypto.BinaryLike,
    plainText: string,
  ): string {
    const cipher = Crypto.createCipheriv('aes-128-cbc', key, iv);
    let ret = cipher.update(plainText, 'utf8', 'base64');
    ret += cipher.final('base64');
    return ret;
  }

  rsaEncrypt(publicKey: string, aesKey: any): any {
    const key = new NodeRSA(
      '-----BEGIN PUBLIC KEY-----\n' + publicKey + '\n-----END PUBLIC KEY-----',
    );
    key.setOptions({ encryptionScheme: 'pkcs1' });
    return key.encrypt(aesKey, 'base64', 'utf8');
  }

  getPublicKey(apiKey: string): any {
    const uri =
      process.env.LICENTRUTH_API_HOST +
      '/api/Auth/GetPublicKey?APIkey=' +
      apiKey;
    const options = {
      json: true,
    };
    const response = Request('GET', uri, options);
    const rsaPublicKey = JSON.parse(response.getBody('utf8')).PublicKey;
    return rsaPublicKey;
  }
}
