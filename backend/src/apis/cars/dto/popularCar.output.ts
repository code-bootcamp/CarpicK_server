import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '인기차 OUTPUT' })
export class PopularCarOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  ownerName: string;

  @Field(() => String)
  carNumber: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  oil: string;

  @Field(() => String)
  carModel: string;

  @Field(() => String)
  addressDetail: string;

  @Field(() => Int)
  num: number;

  @Field(() => Float)
  rating: number;
}
