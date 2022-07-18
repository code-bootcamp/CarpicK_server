import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { PaymentService } from '../payments/payment.service';
import { IamportService } from '../iamport/iamport.service';
import { Payment } from '../payments/entities/payment.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Payment, User])],
  providers: [
    ReservationResolver,
    ReservationService,
    PaymentService,
    IamportService,
  ],
})
export class ReservationModule {}
