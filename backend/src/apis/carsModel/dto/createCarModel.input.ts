import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '모델 INPUT' })
export class CreateCarModelInput {
  @Field(() => String, { description: '모델명' })
  name: string;

  @Field(() => String, { description: '차종' })
  carCategoryName: string;
}
