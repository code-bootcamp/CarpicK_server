import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarResolver } from './car.resolver';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  providers: [
    CarResolver, //
    CarService,
  ],
})
export class CarModule {}
