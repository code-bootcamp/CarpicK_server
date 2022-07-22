import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { Reservation } from 'src/apis/reservations/entities/reservation.entity';
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
@ObjectType({ description: '결제 TYPE' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column()
  @Field(() => String, { description: 'IMPUID' })
  impUid: string;

  @Column()
  @Min(0)
  @Field(() => Int, { description: '결제 금액' })
  amount: number;

  @Column()
  @Field(() => String, { description: '결제 방식' })
  paymentMethod: string;

  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
  @Field(() => PAYMENT_STATUS_ENUM, {
    nullable: true,
    description: '결제 상태',
  })
  status: string;

  @CreateDateColumn()
  createAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Reservation)
  @Field(() => Reservation)
  reservation: Reservation;
}
