import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CarCategoryService } from './carCategory.service';
import { CreateCarCategoryInput } from './dto/createCarCategory.input';
import { CarCategory } from './entities/carCategory.entity';

@Resolver()
export class CarCategoryResolver {
  constructor(
    private readonly carCategoryService: CarCategoryService, //
  ) {}

  @Query(() => [CarCategory], { description: '차종 조회' })
  fetchCarCategory() {
    return this.carCategoryService.findAll();
  }


  @Mutation(() => CarCategory, { description: '차종 생성' })
  createCarCategory(
    @Args('createCarCategoryInput')
    createCarCategoryInput: CreateCarCategoryInput, //
  ) {
    return this.carCategoryService.create({ createCarCategoryInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '차종 삭제' })
  deleteCarCategory(
    @Args({ name: 'carCategoryId', description: '차종 UUID' })
    carCategoryId: string, //
  ) {
    return this.carCategoryService.delete({ carCategoryId });
  }
}
