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
  @Query(() => [Reservation], { description: '예약 내역 조회' })
  fetchUserReservations(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @CurrentUser('currentUser') currentUser: ICurrentUser,
  ) {
    return this.reservationService.userFindAll({ currentUser, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Reservation], { description: '내차량 현황 조회' })
  fetchOwnerReservations(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @CurrentUser('currentUser') currentUser: ICurrentUser,
  ) {
    return this.reservationService.ownerFindAll({ currentUser, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Reservation, { description: '예약 생성' })
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

  @Mutation(() => Reservation, { description: '예약 상태 업데이트' })
  async updateReservationStatus(
    @Args('reservationId') reservationId: string,
    @Args('status') status: string,
  ) {
    return await this.reservationService.update({ reservationId, status });
  }
}
