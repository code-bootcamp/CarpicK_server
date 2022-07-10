import { Field, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { CarRegistration } from 'src/apis/carsRegistration/entities/carRegistration.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ImageRegistration {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @ManyToOne(() => Car)
  @Field(() => Car)
  car: Car;

  @ManyToOne(() => CarRegistration)
  @Field(() => CarRegistration)
  carRegistration: CarRegistration;
}
