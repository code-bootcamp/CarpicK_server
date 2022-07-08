import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarCategory } from '../carsCategory/entities/carCategory.entity';
import { CarModelResolver } from './carModel.resolver';
import { CarModelService } from './carModel.service';
import { CarModel } from './entities/carModel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarModel, CarCategory])],
  providers: [
    CarModelResolver, //
    CarModelService,
  ],
})
export class CarModelModule {}
