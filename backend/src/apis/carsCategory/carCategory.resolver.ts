import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CarCategoryService } from './carCategory.service';
import { CreateCarCategoryInput } from './dto/createCarCategory.input';
import { CarCategory } from './entities/carCategory.entity';

@Resolver()
export class CarCategoryResolver {
  constructor(
    private readonly carCategoryService: CarCategoryService, //
  ) {}

  @Query(() => [CarCategory])
  fetchCarCategory() {
    return this.carCategoryService.findAll();
  }

  @Mutation(() => CarCategory)
  createCarCategory(
    @Args('createCarCategoryInput')
    createCarCategoryInput: CreateCarCategoryInput, //
  ) {
    return this.carCategoryService.create({ createCarCategoryInput });
  }

  @Mutation(() => Boolean)
  deleteCarCategory(
    @Args('carCategoryId') carCategoryId: string, //
  ) {
    return this.carCategoryService.delete({ carCategoryId });
  }
}
