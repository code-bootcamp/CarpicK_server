import { Field, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { CarRegistration } from 'src/apis/carsRegistration/entities/carRegistration.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType({ description: '차량 이미지 TYPE' })
export class ImageCar {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column()
  @Field(() => String, { description: 'URL' })
  url: string;

  @ManyToOne(() => Car)
  @Field(() => Car)
  car: Car;

  @ManyToOne(() => CarRegistration)
  @Field(() => CarRegistration)
  carRegistration: CarRegistration;
}
