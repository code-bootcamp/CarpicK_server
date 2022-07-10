import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageCar } from '../imagesCar/entities/imageCar.entity';
import { ImageRegistration } from '../imagesRegistration/entities/imageRegistration.entity';
import { CarRegistrationResolver } from './carRegistration.resolver';
import { CarRegistrationService } from './carRegistration.service';
import { CarRegistration } from './entities/carRegistration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarRegistration, ImageCar, ImageRegistration]),
  ],
  providers: [
    CarRegistrationResolver, //
    CarRegistrationService,
  ],
})
export class CarRegistrationModule {}
