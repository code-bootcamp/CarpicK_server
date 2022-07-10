import { Field, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ImageReturn {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @ManyToOne(() => Car)
  @Field(() => Car)
  car: Car;
}
