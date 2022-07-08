import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { OIL_ENUM } from 'src/apis/cars/entities/car.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum REGISTATION_STATUS_ENUM {
  IN_PROCESS = '심사중',
  PASS = '승인',
  FAIL = '거절',
}

registerEnumType(REGISTATION_STATUS_ENUM, {
  name: 'REGISTATION_STATUS_ENUM',
});
@Entity()
@ObjectType()
export class CarRegistration {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  carNumber: string;

  @Column()
  @Field(() => Boolean)
  isHipass: boolean;

  @Column()
  @Field(() => String)
  model: string;

  @Column({ type: 'enum', enum: OIL_ENUM })
  @Field(() => OIL_ENUM)
  oil: string;

  @Column({ type: 'enum', enum: REGISTATION_STATUS_ENUM })
  @Field(() => REGISTATION_STATUS_ENUM)
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
