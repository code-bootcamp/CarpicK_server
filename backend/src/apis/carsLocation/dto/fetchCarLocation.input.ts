import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class FetchCarLocationInput {
  @Field(() => Float)
  southWestLng?: number;

  @Field(() => Float)
  northEastLng?: number;

  @Field(() => Float)
  southWestLat?: number;

  @Field(() => Float)
  northEastLat?: number;

  @Field(() => [String], { nullable: true })
  filter?: string;
}
