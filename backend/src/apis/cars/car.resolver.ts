import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CarService } from './car.service';
import { CreateCarInput } from './dto/createCar.entity';
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
    @Args('carLocationId') carLocationId: string, //
    @Args({ name: 'page', nullable: true, type: () => Int }) page?: number,
  ) {
    return this.carService.findAll({ carLocationId, page });
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
    if (result) return ' 차량이 삭제되었습니다.';
  }
}
