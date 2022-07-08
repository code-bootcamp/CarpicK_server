import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  providers: [
    ReservationResolver, //
    ReservationService,
  ],
})
export class ReservationModule {}
