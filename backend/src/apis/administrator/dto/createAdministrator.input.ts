import { InputType, OmitType } from '@nestjs/graphql';
import { Administrator } from '../entities/administrator.entity';

@InputType()
export class CreateAdministratorInput extends OmitType(
  Administrator,
  ['id'],
  InputType,
) {}
