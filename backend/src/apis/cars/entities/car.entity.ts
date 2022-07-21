import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CarLocation } from 'src/apis/carsLocation/entities/carLocation.entity';
import { CarModel } from 'src/apis/carsModel/entities/carModel.entity';
import { ImageCar } from 'src/apis/imagesCar/entities/imageCar.entity';
import { ImageRegistration } from 'src/apis/imagesRegistration/entities/imageRegistration.entity';
import { ImageStart } from 'src/apis/imagesStart/entities/imageStart.entity';
import { ImageEnd } from 'src/apis/imageEnd/entities/imageEnd.entity';
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
@ObjectType({ description: '차량 TYPE' })
export class Car {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column({ unique: true })
  @Field(() => String, { description: '차량번호' })
  carNumber: string;

  @Column()
  @Field(() => Boolean, { description: '하이패스 여부' })
  isHipass: boolean;

  @Column()
  @Min(0)
  @Field(() => Int, { description: '시간당 가격' })
  price: number;

  @Column()
  @Field(() => String, { description: '유종' })
  oil: string;

  @Column()
  @Field(() => Date, { description: '계약시작 시간' })
  contractStart: Date;

  @Column()
  @Field(() => Date, { description: '계약종료 시간' })
  contractEnd: Date;

  @Column()
  @Field(() => Boolean, { description: '계약 여부', nullable: true })
  isVaild?: boolean;

  @Column({ default: false })
  @Field(() => Boolean, { description: '키 사용가능 여부', nullable: true })
  isAvailable?: boolean;

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

  @OneToMany(() => ImageStart, (imageStart) => imageStart.car)
  @Field(() => [ImageStart])
  imageStart: ImageStart[];

  @OneToMany(() => ImageEnd, (imageEndImageEnd) => imageEndImageEnd.car)
  @Field(() => [ImageEnd])
  imageEnd: ImageEnd[];

  @OneToMany(() => Review, (review) => review.car)
  @Field(() => [Review])
  review: Review[];

  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  user: User;
}
