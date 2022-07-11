import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class FetchCarLocationInput {
  @Field(() => Float)
  lat?: number;

  @Field(() => Float)
  lng?: number;

  @Field(() => [String])
  filter?: string;
}
