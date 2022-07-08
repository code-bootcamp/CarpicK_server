import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CarCategoryService } from './carCategory.service';
import { CreateCarCategoryInput } from './dto/createCarCategory.input';
import { CarCategory } from './entities/carCategory.entity';

@Resolver()
export class CarCategoryResolver {
  constructor(
    private readonly carCategoryService: CarCategoryService, //
  ) {}

  @Mutation(() => CarCategory)
  createCarCategory(
    @Args('createCarCategoryInput')
    createCarCategoryInput: CreateCarCategoryInput, //
  ) {
    return this.carCategoryService.create({ createCarCategoryInput });
  }
}
