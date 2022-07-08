import { Field, InputType, PickType } from '@nestjs/graphql';
import { Reservation } from '../entities/reservation.entity';

@InputType()
export class CreateReservationInput extends PickType(
  Reservation,
  ['startTime', 'endTime', 'amount'],
  InputType,
) {
  @Field(() => String)
  carId: string;
}
