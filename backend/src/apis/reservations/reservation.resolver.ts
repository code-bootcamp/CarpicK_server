import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput } from './dto/createReservation';
import {
  ConflictException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { PaymentInput } from '../payments/dto/payment.input';
import { PaymentService } from '../payments/payment.service';
import { IamportService } from '../iamport/iamport.service';

@Resolver()
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly paymentService: PaymentService,
    private readonly iamportService: IamportService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Reservation], { description: '예약 내역 조회' })
  fetchUserReservations(
    @Args({
      name: 'page',
      type: () => Int,
      nullable: true,
      description: '페이지 넘버',
    })
    page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<Reservation[]> {
    return this.reservationService.userFindAll({ currentUser, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Reservation], { description: '내차량 현황 조회' })
  fetchOwnerReservations(
    @Args({
      name: 'page',
      type: () => Int,
      nullable: true,
      description: '페이지 넘버',
    })
    page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<Reservation[]> {
    return this.reservationService.ownerFindAll({ currentUser, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Reservation, { description: '예약 생성' })
  async createReservation(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput, //
    @Args('paymentInput') paymentInput: PaymentInput,
  ): Promise<Reservation> {
    const access_token = await this.iamportService.getToken();
    const paymentData = await this.iamportService.getInfo({
      access_token,
      impUid: paymentInput.impUid,
    });

    const { amount } = paymentData;
    if (amount !== paymentInput.amount)
      throw new UnprocessableEntityException('유효하지 않은 결제입니다');

    const isAuth = await this.paymentService.findOne({
      impUid: paymentInput.impUid,
    });
    if (isAuth) throw new ConflictException('이미 처리된 결제입니다');

    const resevation = await this.reservationService.create({
      currentUser,
      createReservationInput,
    });

    await this.paymentService.create({
      reservationId: resevation.id,
      carId: createReservationInput.carId,
      paymentInput,
      currentUser,
    });
    return resevation;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '예약 취소' })
  async cancelReservation(
    @Args({ name: 'reservationId', description: '예약 UUID' })
    reservationId: string,
    @Args('paymentInput') paymentInput: PaymentInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<string> {
    const payment = await this.paymentService.findAll({
      impUid: paymentInput.impUid,
    });

    if (payment.length === 2)
      throw new UnprocessableEntityException('이미 취소된 결제입니다');

    const access_token = await this.iamportService.getToken();

    await this.iamportService.cancel({
      access_token,
      impUid: paymentInput.impUid,
      amount: paymentInput.amount,
    });

    const reservation = await this.reservationService.findOne({
      reservationId,
    });

    await this.paymentService.cancel({
      reservationId,
      carId: reservation.car.id,
      paymentInput,
      currentUser,
    });

    const result = await this.reservationService.update({
      reservationId,
      status: 'CANCEL',
    });

    if (result) return '취소되었습니다';
    else return '취소를 실패하였습니다';
  }
}
