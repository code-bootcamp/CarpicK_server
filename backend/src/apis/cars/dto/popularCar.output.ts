import { Field, Float, ObjectType, PartialType } from '@nestjs/graphql';
import { Car } from '../entities/car.entity';

@ObjectType({ description: '인기차 OUTPUT' })
export class PopularCarOutput extends PartialType(Car, ObjectType) {
  @Field(() => Float, { description: '평균 평점', defaultValue: 0 })
  rating: number;
}
