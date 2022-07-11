import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CarRegistration } from '../entities/carRegistration.entity';

@InputType()
export class CreateCarRegistrationInput extends OmitType(
  CarRegistration,
  ['id', 'status', 'createdAt', 'updatedAt', 'imageCar', 'imageRegistration'],
  InputType,
) {
  @Field(() => [String])
  carUrl: string;

  @Field(() => String)
  registrationUrl: string;
}
