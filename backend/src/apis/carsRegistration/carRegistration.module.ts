import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarRegistrationResolver } from './carRegistration.resolver';
import { CarRegistrationService } from './carRegistration.service';
import { CarRegistration } from './entities/carRegistration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarRegistration])],
  providers: [
    CarRegistrationResolver, //
    CarRegistrationService,
  ],
})
export class CarRegistrationModule {}
