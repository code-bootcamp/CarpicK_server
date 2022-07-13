import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { OIL_ENUM } from 'src/apis/cars/entities/car.entity';
import { ImageCar } from 'src/apis/imagesCar/entities/imageCar.entity';
import { ImageRegistration } from 'src/apis/imagesRegistration/entities/imageRegistration.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum REGISTATION_STATUS_ENUM {
  IN_PROCESS = '심사중',
  PASS = '승인',
  FAIL = '거절',
  EXPIRATION = '계약종료',
}

registerEnumType(REGISTATION_STATUS_ENUM, {
  name: 'REGISTATION_STATUS_ENUM',
});
@Entity()
@ObjectType()
export class CarRegistration {
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
  @Field(() => String)
  model: string;

  @Column({ type: 'enum', enum: OIL_ENUM })
  @Field(() => OIL_ENUM)
  oil: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column({ type: 'enum', enum: REGISTATION_STATUS_ENUM })
  @Field(() => REGISTATION_STATUS_ENUM)
  status?: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @OneToMany(() => ImageCar, (imageCar) => imageCar.carRegistration)
  @Field(() => [ImageCar])
  imageCar: ImageCar[];

  @JoinColumn()
  @OneToOne(() => ImageRegistration)
  @Field(() => ImageRegistration)
  imageRegistration: ImageRegistration;

  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  user: User;
}
