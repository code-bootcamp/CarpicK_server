import { Field, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { Reservation } from 'src/apis/reservations/entities/reservation.entity';
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

  @ManyToOne(() => Car, { onDelete: 'CASCADE' })
  @Field(() => Car)
  car: Car;

  @ManyToOne(() => Reservation, { onDelete: 'CASCADE' })
  @Field(() => Reservation)
  reservation: Reservation;
}
