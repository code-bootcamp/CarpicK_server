import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { ReservationService } from '../reservations/reservation.service';
import { PaymentInput } from './dto/payment.input';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly reservationService: ReservationService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment, { description: '패널티 결제' })
  async createPenaltyPayment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('reservationId') reservationId: string,
    @Args('paymentInput') paymentInput: PaymentInput,
  ) {
    const reservation = await this.reservationService.findOne({
      reservationId,
    });
    await this.reservationService.update({ reservationId, status: 'RETURN' });
    return await this.paymentService.create({
      reservationId,
      carId: reservation.car.id,
      paymentInput,
      currentUser,
    });
  }
}
