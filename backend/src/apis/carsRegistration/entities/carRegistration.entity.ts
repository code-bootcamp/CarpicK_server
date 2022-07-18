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
@ObjectType({ description: '등록 차량 TYPE' })
export class CarRegistration {
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
  @Field(() => String, { description: '모델명' })
  model: string;

  @Column()
  @Field(() => String, { description: '유종' })
  oil: string;

  @Column()
  @Field(() => String, { description: '주소' })
  address: string;

  @Column({ default: 'IN_PROCESS' })
  @Field(() => String, { description: '심사 상태', nullable: true })
  status?: string;

  @CreateDateColumn()
  @Field(() => Date, { description: '등록시간' })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date, { description: '갱신시간' })
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
