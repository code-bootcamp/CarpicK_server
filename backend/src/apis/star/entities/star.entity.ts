import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Star {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Float)
  totalStar: number;

  @Column()
  @Field(() => Float)
  avgStar: number;

  @Column()
  @Field(() => Int)
  users: number;
}
