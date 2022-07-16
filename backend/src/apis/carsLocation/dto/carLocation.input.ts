import { InputType, OmitType } from '@nestjs/graphql';
import { CarLocation } from '../entities/carLocation.entity';

@InputType({ description: '차량존 생성 INPUT' })
export class CarLocationInput extends OmitType(
  CarLocation,
  ['id', 'car'],
  InputType,
) {}
