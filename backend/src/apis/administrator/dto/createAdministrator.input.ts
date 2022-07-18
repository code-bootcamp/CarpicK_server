import { InputType, OmitType } from '@nestjs/graphql';
import { Administrator } from '../entities/administrator.entity';

@InputType({ description: '관리자 생성 INPUT' })
export class CreateAdministratorInput extends OmitType(
  Administrator,
  ['id'],
  InputType,
) {}
