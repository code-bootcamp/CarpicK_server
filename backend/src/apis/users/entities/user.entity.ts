import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CarRegistration } from 'src/apis/carsRegistration/entities/carRegistration.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column({ unique: true })
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => Boolean)
  isAuth: boolean;

  @Column({ default: 0 })
  @Min(0)
  @Field(() => Int)
  revenue: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn()
  @OneToOne(() => CarRegistration)
  @Field(() => CarRegistration)
  carRegistration: CarRegistration;
}
