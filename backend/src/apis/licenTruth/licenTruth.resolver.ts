import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LicenTruthService } from './licenTruth.service';
import Request from 'sync-request';
import * as Crypto from 'crypto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class LicenTruthResolver {
  constructor(
    private readonly licenTruthService: LicenTruthService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '운전면허 확인' })
  checkLicense(
    @Args({ name: 'BirthDate', description: '생년월일' }) BirthDate: string,
    @Args({ name: 'Name', description: '이름' }) Name: string,
    @Args({ name: 'LicNumber', description: '면허번호' }) LicNumber: string,
    @Args({ name: 'SpecialNumber', description: '식별번호' })
    SpecialNumber: string,
  ): string {
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
    return res.getBody('utf8');
  }
}
