import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCarModel(
    @Args('carModelId') carModelId: string, //
  ) {
    return this.carModelService.delete({ carModelId });
  }
}
