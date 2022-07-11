import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CarLocation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  addressDetail: string;

  @Column({ type: 'double' })
  @Field(() => Float)
  lat: number;

  @Column({ type: 'double' })
  @Field(() => Float)
  lng: number;

  @OneToMany(() => Car, (car) => car.carLocation)
  @Field(() => [Car])
  car: Car[];
}
