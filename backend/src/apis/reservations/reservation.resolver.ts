import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput } from './dto/createReservation';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';

@Resolver()
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService, //
  ) {}

  @Query(() => [Reservation])
  fetchReservations(
    @Args({ name: 'page', nullable: true, type: () => Int }) page?: number,
  ) {
    return this.reservationService.findAll(page);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Reservation)
  async createReservation(
    @CurrentUser('currentUser') currentUser: ICurrentUser,
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput, //
  ) {
    return await this.reservationService.create({
      currentUser,
      createReservationInput,
    });
  }
}
