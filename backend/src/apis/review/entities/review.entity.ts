import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { Car } from 'src/apis/cars/entities/car.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType({ description: '리뷰 TYPE' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Min(1)
  @Max(5)
  @Column()
  @Field(() => Int, { description: '평점' })
  rating: number;

  @ManyToOne(() => Car)
  @Field(() => Car)
  car: Car;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
