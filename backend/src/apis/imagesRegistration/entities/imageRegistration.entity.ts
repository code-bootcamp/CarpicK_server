import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType({ description: '차량등록증 TYPE' })
export class ImageRegistration {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column()
  @Field(() => String, { description: 'URL' })
  url: string;
}
