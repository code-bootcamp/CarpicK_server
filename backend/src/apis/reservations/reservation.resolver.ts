import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput } from './dto/createReservation';

@Resolver()
export class ReservationResolver {
  constructor(
    private readonly carCategoryService: ReservationService, //
  ) {}

  @Mutation(() => Reservation)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput, //
  ) {
    return this.carCategoryService.create({ createReservationInput });
  }
}
