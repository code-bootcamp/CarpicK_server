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
@ObjectType({ description: '유저 TYPE' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column()
  @Field(() => String, { description: '이름' })
  name: string;

  @Column({ unique: true })
  @Field(() => String, { description: '이메일' })
  email: string;

  @Column()
  @Field(() => String, { description: '비밀번호' })
  password: string;

  @Column({ unique: true })
  @Field(() => String, { description: '핸드폰 번호' })
  phone: string;

  @Column()
  @Field(() => Boolean, { description: '면허인증 여부' })
  isAuth: boolean;

  @Column({ default: 0 })
  @Min(0)
  @Field(() => Int, { description: '등록차량 총수익' })
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
