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

  @Query(() => Car, { description: '차량 조회' })
  fetchCar(
    @Args('carId') carId: string, //
  ) {
    return this.carService.findOne({ carId });
  }

  @Query(() => [Car], { description: '차량존 리스트 조회' })
  fetchCars(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args('carLocationId') carLocationId: string, //
  ) {
    return this.carService.findAll({ carLocationId, page });
  }

  @Query(() => [PopularCarOutput], { description: '인기 차량 조회' })
  fetchPopularCars() {
    return this.carService.findPopularAll();
  }

  @Mutation(() => Car, { description: '차량 생성' })
  createCar(
    @Args('createCarInput')
    createCarInput: CreateCarInput, //
  ) {
    return this.carService.create({ createCarInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '차량 삭제' })
  async deleteCar(@Args('carId') carId: string) {
    const result = this.carService.delete({ carId });
    if (result) return '차량이 삭제되었습니다';
  }
}
