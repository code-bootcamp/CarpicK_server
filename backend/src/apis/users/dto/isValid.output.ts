import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IsVaildEmail {
  @Field(() => Boolean)
  isValid: boolean;

  @Field(() => String)
  phone?: string;
}
