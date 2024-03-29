import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CarRegistration } from '../entities/carRegistration.entity';

@InputType({ description: '등록 차량 생성 INPUT' })
export class CreateCarRegistrationInput extends OmitType(
  CarRegistration,
  [
    'id',
    'status',
    'createdAt',
    'updatedAt',
    'imageCar',
    'imageRegistration',
    'user',
  ],
  InputType,
) {
  @Field(() => [String])
  carUrl: string[];

  @Field(() => String)
  registrationUrl: string;
}
