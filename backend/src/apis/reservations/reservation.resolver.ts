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
    @Args({
      name: 'page',
      type: () => Int,
      defaultValue: 1,
      description: '페이지 넘버',
    })
    page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.reservationService.userFindAll({ currentUser, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Reservation])
  afetchOwnerReservations(
    @Args({
      name: 'page',
      type: () => Int,
      defaultValue: 1,
      description: '페이지 넘버',
    })
    page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.reservationService.ownerFindAll({ currentUser, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Reservation)
  createReservation(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput, //
  ) {
    return this.reservationService.create({
      currentUser,
      createReservationInput,
    });
  }

  @Mutation(() => Reservation)
  updateReservationStatus(
    @Args({ name: 'reservationId', description: '예약 UUID' })
    reservationId: string,
    @Args({ name: 'status', description: '예약 상태' }) status: string,
  ) {
    return this.reservationService.update({ reservationId, status });
  }
}
