import { Field, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { CarCategory } from 'src/apis/carsCategory/entities/carCategory.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType({ description: '모델 TYPE' })
export class CarModel {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column({ unique: true })
  @Field(() => String, { description: '모델명' })
  name: string;

  @ManyToOne(() => CarCategory, { onDelete: 'CASCADE' })
  @Field(() => CarCategory)
  carCategory: CarCategory;

  @OneToMany(() => Car, (car) => car.carModel)
  @Field(() => Car)
  car: Car;
}
