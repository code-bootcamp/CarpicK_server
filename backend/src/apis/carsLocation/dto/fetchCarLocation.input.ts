import { Field, Float, InputType } from '@nestjs/graphql';

@InputType({ description: '차량존 조회 INPUT' })
export class FetchCarLocationInput {
  @Field(() => Float, { description: '남서 경도' })
  southWestLng: number;

  @Field(() => Float, { description: '북동 경도' })
  northEastLng: number;

  @Field(() => Float, { description: '남서 위도' })
  southWestLat: number;

  @Field(() => Float, { description: '북동 위도' })
  northEastLat: number;

  @Field(() => [String], { description: '차종 필터', nullable: true })
  filter?: string;
}
