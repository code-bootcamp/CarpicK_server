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
@ObjectType({ description: '예약 TYPE' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column()
  @Field(() => Date, { description: '시작 시간' })
  startTime: Date;

  @Column()
  @Field(() => Date, { description: '종료 시간' })
  endTime: Date;

  @Column()
  @Field(() => Int, { description: '결제 금액' })
  amount: number;

  @Column({ default: 'RESERVATION' })
  @Field(() => String, { description: '예약 상태', nullable: true })
  status?: string;

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
