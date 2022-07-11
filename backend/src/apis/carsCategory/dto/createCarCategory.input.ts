import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCarCategoryInput {
  @Field(() => String)
  name: string;
}
