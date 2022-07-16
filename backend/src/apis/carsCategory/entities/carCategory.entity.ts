import { Field, ObjectType } from '@nestjs/graphql';
import { CarModel } from 'src/apis/carsModel/entities/carModel.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType({ description: '차종 TYPE' })
export class CarCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column({ unique: true })
  @Field(() => String, { description: '차종' })
  name: string;

  @OneToMany(() => CarModel, (carModel) => carModel.carCategory, {
    cascade: true,
  })
  @Field(() => [CarModel])
  carModel: CarModel[];
}
