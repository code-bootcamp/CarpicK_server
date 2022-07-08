import { Field, InputType, OmitType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  phone: string;

  @Field(() => Boolean)
  isAuth: boolean;
}
@InputType()
export class CreateCarRegistrationInput extends OmitType(
  User,
  ['id', 'revenue', 'createdAt', 'updatedAt', 'deletedAt'],
  InputType,
) {}
