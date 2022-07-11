import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarLocationResolver } from './carLocation.resolver';
import { CarLocationService } from './carLocation.service';
import { CarLocation } from './entities/carLocation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarLocation])],
  providers: [
    CarLocationResolver, //
    CarLocationService,
  ],
})
export class CarLocationModule {}
