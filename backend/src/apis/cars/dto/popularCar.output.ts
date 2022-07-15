import { Field, Float, ObjectType, PartialType } from '@nestjs/graphql';
import { Car } from '../entities/car.entity';

@ObjectType()
export class PopularCarOutput extends PartialType(Car) {
  @Field(() => Float)
  rating: number;
}
