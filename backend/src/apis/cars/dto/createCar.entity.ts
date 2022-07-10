import { Field, InputType, PickType } from '@nestjs/graphql';
import { CarLocationInput } from 'src/apis/carsLocation/dto/carLocation.input';
import { Car } from '../entities/car.entity';

@InputType()
export class CreateCarInput extends PickType(
  Car,
  ['carNumber', 'isHipass', 'price', 'oil', 'contractPeriod'],
  InputType,
) {
  @Field(() => String)
  carModelName: string;

  @Field(() => CarLocationInput)
  carLocation: CarLocationInput;

  @Field(() => [String])
  carUrl: string;

  @Field(() => String)
  registrationUrl: string;
}
