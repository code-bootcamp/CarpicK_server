import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportService } from '../iamport/iamport.service';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ReservationService } from '../reservations/reservation.service';
import { User } from '../users/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment, //
      User,
      Reservation,
    ]),
  ],
  providers: [
    PaymentResolver,
    PaymentService,
    IamportService,
    ReservationService,
  ],
})
export class PaymentModule {}
