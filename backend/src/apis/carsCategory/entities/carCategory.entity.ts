import { Field, ObjectType } from '@nestjs/graphql';
import { CarModel } from 'src/apis/carsModel/entities/carModel.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CarCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @OneToMany(() => CarModel, (carModel) => carModel.carCategory, {
    cascade: true,
  })
  @Field(() => [CarModel])
  carModel: CarModel[];
}
