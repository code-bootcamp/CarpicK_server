import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PAYMENT_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCLE = 'CANCLE',
}

registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'PAYMENT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  @Min(0)
  @Field(() => Int)
  amount: number;

  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
  @Field(() => PAYMENT_STATUS_ENUM, { nullable: true })
  status: string;

  @Column()
  @Field(() => String)
  paymentMethod: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
