import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CarService } from './car.service';
import { CreateCarInput } from './dto/createCar.entity';
import { PopularCarOutput } from './dto/popularCar.output';
import { Car } from './entities/car.entity';

@Resolver()
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Query(() => Car)
  fetchCar(
    @Args('carId') carId: string, //
  ) {
    return this.carService.findOne({ carId });
  }

  @Query(() => [Car])
  fetchCars(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args('carLocationId') carLocationId: string, //
  ) {
    return this.carService.findAll({ carLocationId, page });
  }

  @Query(() => [PopularCarOutput])
  fetchPopularCars() {
    return this.carService.findPopularAll();
  }

  @Mutation(() => Car)
  createCar(
    @Args('createCarInput')
    createCarInput: CreateCarInput, //
  ) {
    return this.carService.create({ createCarInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteCar(@Args('carId') carId: string) {
    const result = this.carService.delete({ carId });
    if (result) return '차량이 삭제되었습니다';
  }
}
