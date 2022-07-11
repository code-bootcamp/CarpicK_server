import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCarModelInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  carCategoryName: string;
}
