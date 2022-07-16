import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '유효이메일 OUTPUT' })
export class IsVaildEmail {
  @Field(() => Boolean, { description: '사용가능 여부' })
  isValid: boolean;

  @Field(() => String, { description: '전화번호' })
  phone: string;
}
