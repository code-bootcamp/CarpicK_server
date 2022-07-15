import { Field, ObjectType } from '@nestjs/graphql';
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

  @Column()
  @Field(() => String)
  oil: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column({ default: 'IN_PROCESS' })
  @Field(() => String)
  status: string;

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
