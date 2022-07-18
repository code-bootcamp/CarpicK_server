import { InputType, PickType } from '@nestjs/graphql';
import { Payment } from '../entities/payment.entity';

@InputType({ description: '결제 생성 INPUT' })
export class PaymentInput extends PickType(
  Payment,
  ['amount', 'impUid', 'paymentMethod'],
  InputType,
) {}
