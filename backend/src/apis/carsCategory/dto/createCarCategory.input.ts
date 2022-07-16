import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '차종 생성 INPUT' })
export class CreateCarCategoryInput {
  @Field(() => String, { description: '차종' })
  name: string;
}
