import { Field, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/apis/cars/entities/car.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType({ description: '탑승전 이미지 TYPE' })
export class ImageStart {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column()
  @Field(() => String, { description: 'URL' })
  url: string;

  @ManyToOne(() => Car)
  @Field(() => Car)
  car: Car;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
