import { Field, InputType, PickType } from '@nestjs/graphql';
import { CarLocationInput } from 'src/apis/carsLocation/dto/carLocation.input';
import { Car } from '../entities/car.entity';

@InputType({ description: '차량 생성 INPUT' })
export class CreateCarInput extends PickType(
  Car,
  ['carNumber', 'isHipass', 'price', 'oil', 'contractStart', 'contractEnd'],
  InputType,
) {
  @Field(() => String, { description: '유저 UUID' })
  userId: string;

  @Field(() => String, { description: '모델명' })
  carModelName: string;

  @Field(() => CarLocationInput)
  carLocation: CarLocationInput;

  @Field(() => [String], { description: '차량 이미지' })
  carUrl: string[];

  @Field(() => String, { description: '차량등록증 이미지' })
  registrationUrl: string;
}
