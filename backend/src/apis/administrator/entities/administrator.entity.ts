import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType({ description: '관리자 TYPE' })
export class Administrator {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'UUID' })
  id: string;

  @Column()
  @Field(() => String, { description: '관리자 ID' })
  adminId: string;

  @Column()
  @Field(() => String, { description: '관리자 비밀번호' })
  password: string;
}
