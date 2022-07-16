import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CarLocation } from 'src/apis/carsLocation/entities/carLocation.entity';
import { CarModel } from 'src/apis/carsModel/entities/carModel.entity';
import { ImageCar } from 'src/apis/imagesCar/entities/imageCar.entity';
import { ImageRegistration } from 'src/apis/imagesRegistration/entities/imageRegistration.entity';
import { ImageReservation } from 'src/apis/imagesReservation/entities/imageReservation.entity';
import { ImageReturn } from 'src/apis/imagesReturn/entities/imageReturn.entity';
import { Reservation } from 'src/apis/reservations/entities/reservation.entity';
import { Review } from 'src/apis/review/entities/review.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Car {
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
  @Min(0)
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => String)
  oil: string;

  @Column()
  @Field(() => String)
  contractPeriod: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => CarModel, (carmodel) => carmodel.car)
  @Field(() => CarModel)
  carModel: CarModel;

  @ManyToOne(() => CarLocation)
  @Field(() => CarLocation)
  carLocation: CarLocation;

  @OneToMany(() => Reservation, (reservation) => reservation.car)
  @Field(() => [Reservation])
  reservation: Reservation[];

  @OneToMany(() => ImageCar, (imageCar) => imageCar.car)
  @Field(() => [ImageCar])
  imageCar: ImageCar[];

  @JoinColumn()
  @OneToOne(() => ImageRegistration)
  @Field(() => ImageRegistration)
  imageRegistration: ImageRegistration;

  @OneToMany(() => ImageReservation, (imageReservation) => imageReservation.car)
  @Field(() => [ImageReservation])
  imageReservation: ImageReservation[];

  @OneToMany(() => ImageReturn, (imageReturn) => imageReturn.car)
  @Field(() => [ImageReturn])
  imageReturn: ImageReturn[];

  @OneToMany(() => Review, (review) => review.car)
  @Field(() => [Review])
  review: Review[];

  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  user: User;
}
