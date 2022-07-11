import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @Column({ type: 'enum', enum: RESERVATION_STATUS_ENUM })
  @Field(() => RESERVATION_STATUS_ENUM)
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Car)
  @Field(() => Car)
  car: Car;
}
