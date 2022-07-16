import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType({ description: '차량존 TYPE' })
export class CarLocation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column()
  @Field(() => String, { description: '주소' })
  address: string;

  @Column()
  @Field(() => String, { description: '차량존' })
  addressDetail: string;

  @Column({ type: 'double' })
  @Field(() => Float, { description: '위도' })
  lat: number;

  @Column({ type: 'double' })
  @Field(() => Float, { description: '경도' })
  lng: number;

  @OneToMany(() => Car, (car) => car.carLocation)
  @Field(() => [Car])
  car: Car[];
}
