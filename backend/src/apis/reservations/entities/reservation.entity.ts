import { Field, Int, ObjectType } from '@nestjs/graphql';
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

@Entity()
@ObjectType()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Date)
  startTime: Date;

  @Column()
  @Field(() => Date)
  endTime: Date;

  @Column()
  @Field(() => Int)
  amount: number;

  @Column({ default: 'RESERVATION' })
  @Field(() => String)
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
