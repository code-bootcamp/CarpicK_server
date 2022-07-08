import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CarLocation } from 'src/apis/carsLocation/entities/carLocation.entity';
import { CarModel } from 'src/apis/carsModel/entities/carModel.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OIL_ENUM {
  GASOLINE = '휘발유',
  LIGHT_OIL = '경유',
  LPG = 'LPG',
  ELECTRIC = '전기',
}

registerEnumType(OIL_ENUM, {
  name: 'OIL_ENUM',
});

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

  @Column({ type: 'enum', enum: OIL_ENUM })
  @Field(() => OIL_ENUM)
  oil: string;

  @Column()
  @Field(() => String)
  contractPeriod: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => CarModel)
  @Field(() => CarModel)
  carModel: CarModel;

  @ManyToOne(() => CarLocation)
  @Field(() => CarLocation)
  carLocation: CarLocation;
}
