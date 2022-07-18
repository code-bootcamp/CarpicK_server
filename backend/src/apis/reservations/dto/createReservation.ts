import { Field, InputType, PickType } from '@nestjs/graphql';
import { Reservation } from '../entities/reservation.entity';

@InputType({ description: '예약 생성 INPUT' })
export class CreateReservationInput extends PickType(
  Reservation,
  ['startTime', 'endTime', 'amount'],
  InputType,
) {
  @Field(() => String, { description: '차량 UUID' })
  carId: string;
}
