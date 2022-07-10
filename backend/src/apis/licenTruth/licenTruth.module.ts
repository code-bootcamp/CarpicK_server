import { Module } from '@nestjs/common';
import { LicenTruthResolver } from './licenTruth.resolver';
import { LicenTruthService } from './licenTruth.service';

@Module({
  imports: [],
  providers: [
    LicenTruthResolver, //
    LicenTruthService,
  ],
})
export class LicenTruthModule {}
