import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateImageInput {
  @Field(() => [String])
  urls: string[]; // url배열

  @Field(() => String)
  carId: string;
}
