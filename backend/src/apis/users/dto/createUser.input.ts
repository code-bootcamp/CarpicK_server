import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '유저 생성 INPUT' })
export class CreateUserInput {
  @Field(() => String, { description: '이메일' })
  email: string;

  @Field(() => String, { description: '이름' })
  name: string;

  @Field(() => String, { description: '비밀번호' })
  password: string;

  @Field(() => String, { description: '전화번호' })
  phone: string;

  @Field(() => Boolean, { description: '면허인증 여부' })
  isAuth: boolean;
}
