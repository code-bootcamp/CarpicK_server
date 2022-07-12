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

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Reservation])
  fetchUserReservations(
    @CurrentUser('currentUser') currentUser: ICurrentUser,
    @Args({ name: 'page', nullable: true, type: () => Int }) page?: number,
  ) {
    return this.reservationService.userFindAll({ currentUser, page });
  }

  @Query(() => [Reservation])
  fetchOwnerReservations(
    @Args('carId') carId: string,
    @Args({ name: 'page', nullable: true, type: () => Int }) page?: number,
  ) {
    return this.reservationService.ownerFindAll({ carId, page });
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

  @Mutation(() => Reservation)
  async updateReservationStatus(
    @Args('reservationId') reservationId: string,
    @Args('status') status: string,
  ) {
    return await this.reservationService.update({ reservationId, status });
  }
}
