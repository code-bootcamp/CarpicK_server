import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '차량 이용 종료 INPUT' })
export class EndCarInput {
  @Field(() => [String], { description: 'URL' })
  urls: string[];

  @Field(() => String, { description: '차량 UUID' })
  carId: string;

  @Field(() => String, { description: '예약 UUID' })
  reservationId: string;
}
