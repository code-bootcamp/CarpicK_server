import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { ImageStart } from 'src/apis/imagesStart/entities/imageStart.entity';
import { ImageEnd } from 'src/apis/imageEnd/entities/imageEnd.entity';
import { Reservation } from 'src/apis/reservations/entities/reservation.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
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

  @OneToMany(() => ImageStart, (imageStart) => imageStart.user)
  @Field(() => [ImageStart])
  imageStart: ImageStart[];

  @OneToMany(() => ImageEnd, (imageEnd) => imageEnd.user)
  @Field(() => [ImageEnd])
  imageEnd: ImageEnd[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  @Field(() => [Reservation])
  reservation: Reservation[];
}
