import {
  ConflictException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { PaymentInput } from './dto/payment.input';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly paymentService: PaymentService, //
    private readonly iamportService: IamportService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('paymentInput') paymentInput: PaymentInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
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

    return this.paymentService.create({
      paymentInput,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async cancelPayment(
    @Args('paymentInput') paymentInput: PaymentInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const payment = await this.paymentRepository.find({
      where: { impUid: paymentInput.impUid },
    });

    if (payment.length === 2)
      throw new UnprocessableEntityException('이미 취소된 결제입니다');

    const access_token = await this.iamportService.getToken();
    const res = await this.iamportService.cancel({
      access_token,
      impUid: paymentInput.impUid,
      amount: paymentInput.amount,
    });
    console.log(res);

    return this.paymentService.cancel({
      impUid: paymentInput.impUid,
      amount: paymentInput.amount,
      paymentMethod: paymentInput.paymentMethod,
      currentUser,
    });
  }
}