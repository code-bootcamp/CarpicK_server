import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarLocation } from '../carsLocation/entities/carLocation.entity';
import { CarModel } from '../carsModel/entities/carModel.entity';
import { CarResolver } from './car.resolver';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, CarLocation, CarModel])],
  providers: [
    CarResolver, //
    CarService,
  ],
})
export class CarModule {}
