import { Field, ObjectType } from '@nestjs/graphql';
import { CarCategory } from 'src/apis/carsCategory/entities/carCategory.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CarModel {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @ManyToOne(() => CarCategory)
  @Field(() => CarCategory)
  carCategory: CarCategory;
}
