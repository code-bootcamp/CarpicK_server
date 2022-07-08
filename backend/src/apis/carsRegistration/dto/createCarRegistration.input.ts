import { InputType, OmitType } from '@nestjs/graphql';
import { CarRegistration } from '../entities/carRegistration.entity';

@InputType()
export class CreateCarRegistrationInput extends OmitType(
  CarRegistration,
  ['id', 'status', 'createdAt', 'updatedAt'],
  InputType,
) {}
