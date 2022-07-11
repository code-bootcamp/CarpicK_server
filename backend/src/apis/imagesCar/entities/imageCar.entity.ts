import { Field, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { CarRegistration } from 'src/apis/carsRegistration/entities/carRegistration.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ImageCar {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @ManyToOne(() => Car, { onDelete: 'CASCADE' })
  @Field(() => Car)
  car: Car;

  @ManyToOne(() => CarRegistration, { onDelete: 'CASCADE' })
  @Field(() => CarRegistration)
  carRegistration: CarRegistration;
}
