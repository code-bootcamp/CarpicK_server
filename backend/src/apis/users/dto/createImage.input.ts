import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '이미지 생성 INPUT' })
export class CreateImageInput {
  @Field(() => [String], { description: 'URL' })
  urls: string[]; // url배열

  @Field(() => String, { description: '차량 UUID' })
  carId: string;
}
