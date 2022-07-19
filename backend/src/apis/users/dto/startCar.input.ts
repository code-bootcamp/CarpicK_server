import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '차량 이용 시작 INPUT' })
export class StartCarInput {
  @Field(() => [String], { description: 'URL' })
  urls: string[];

  @Field(() => String, { description: '차량 UUID' })
  carId: string;

  @Field(() => String, { description: '예약 UUID' })
  reservationId: string;
}
