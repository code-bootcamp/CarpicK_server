import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { Payment } from 'src/apis/payments/entities/payment.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RESERVATION_STATUS_ENUM {
  RESERVATION = '예약',
  CANCEL = '예약취소',
  RETURN = '반납완료',
  USING = '이용중',
}

registerEnumType(RESERVATION_STATUS_ENUM, {
  name: 'RESERVATION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Column()
  @Field(() => Date, { nullable: true })
  startTime: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  endTime: Date;

  @Column()
  @Field(() => Int, { nullable: true })
  amount: number;

  @Column({ type: 'enum', enum: RESERVATION_STATUS_ENUM })
  @Field(() => RESERVATION_STATUS_ENUM, { nullable: true })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Car)
  @Field(() => Car)
  car: Car;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;
}
