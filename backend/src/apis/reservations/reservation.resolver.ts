import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput } from './dto/createReservation';

@Resolver()
export class ReservationResolver {
  constructor(
    private readonly carCategoryService: ReservationService, //
  ) {}

  @Query(() => [Reservation])
  fetchCarCategory() {
    return this.carCategoryService.findAll();
  }

  @Mutation(() => Reservation)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput, //
  ) {
    return this.carCategoryService.create({ createReservationInput });
  }
}
