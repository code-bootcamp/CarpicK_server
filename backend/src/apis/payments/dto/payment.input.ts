import { InputType, PickType } from '@nestjs/graphql';
import { Payment } from '../entities/payment.entity';

@InputType()
export class PaymentInput extends PickType(
  Payment,
  ['amount', 'impUid', 'paymentMethod'],
  InputType,
) {}
