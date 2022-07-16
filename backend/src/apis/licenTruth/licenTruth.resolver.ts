import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LicenTruthService } from './licenTruth.service';
import Request from 'sync-request';
import * as Crypto from 'crypto';

@Resolver()
export class LicenTruthResolver {
  constructor(
    private readonly licenTruthService: LicenTruthService, //
  ) {}

  @Mutation(() => String, { description: '운전면허 확인' })
  checkLicense(
    @Args('BirthDate') BirthDate: string,
    @Args('Name') Name: string,
    @Args('LicNumber') LicNumber: string,
    @Args('SpecialNumber') SpecialNumber: string,
  ) {
    const rsaPublicKey = this.licenTruthService.getPublicKey(
      process.env.LICENTRUTH_API_KEY,
    );
    const aesKey = Crypto.randomBytes(16);
    const aesIv = Buffer.from([
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
    ]);
    let aesCipherKey = Buffer.alloc(0);
    aesCipherKey = this.licenTruthService.rsaEncrypt(rsaPublicKey, aesKey);
    console.log('aesCipherKey:', aesCipherKey);
    const url = process.env.LICENTRUTH_API_HOST + 'api/v1.0/Efine/LicenTruth';
    const res = Request('POST', url, {
      headers: {
        'Content-Type': 'application/json',
        'API-KEY': process.env.LICENTRUTH_API_KEY,
        'ENC-KEY': aesCipherKey.toString(),
      },
      json: {
        BirthDate,
        Name,
        LicNumber: this.licenTruthService.aesEncrypt(aesKey, aesIv, LicNumber),
        SpecialNumber: this.licenTruthService.aesEncrypt(
          aesKey,
          aesIv,
          SpecialNumber,
        ),
      },
    });
    console.log('res:', res.getBody('utf8'));
    return res.getBody('utf8');
  }
}
