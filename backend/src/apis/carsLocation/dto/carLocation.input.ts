import { InputType, OmitType } from '@nestjs/graphql';
import { CarLocation } from '../entities/carLocation.entity';

@InputType()
export class CarLocationInput extends OmitType(
  CarLocation,
  ['id'],
  InputType,
) {}
