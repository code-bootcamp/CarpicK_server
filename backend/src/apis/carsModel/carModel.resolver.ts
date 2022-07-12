import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CarModelService } from './carModel.service';
import { CreateCarModelInput } from './dto/createCarModel.input';
import { CarModel } from './entities/carModel.entity';

@Resolver()
export class CarModelResolver {
  constructor(
    private readonly carModelService: CarModelService, //
  ) {}

  @Mutation(() => CarModel)
  createCarModel(
    @Args('createCarModelInput') createCarModelInput: CreateCarModelInput, //
  ) {
    return this.carModelService.create({ createCarModelInput });
  }

  @Mutation(() => Boolean)
  deleteCarModel(
    @Args('carModelId') carModelId: string, //
  ) {
    return this.carModelService.delete({ carModelId });
  }
}
