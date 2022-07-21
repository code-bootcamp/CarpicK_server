import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CarService } from './car.service';
import { CreateCarInput } from './dto/createCar.input';
import { PopularCarOutput } from './dto/popularCar.output';
import { Car } from './entities/car.entity';

@Resolver()
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Query(() => Car, { description: '차량 조회' })
  fetchCar(
    @Args({ name: 'carId', description: '차량 UUID' }) carId: string, //
  ): Promise<Car> {
    return this.carService.findOne({ carId });
  }

  @Query(() => [Car], { description: '차량존 리스트 조회' })
  fetchCars(
    @Args({
      name: 'page',
      type: () => Int,
      nullable: true,
      description: '페이지 넘버',
    })
    page: number,
    @Args({ name: 'carLocationId', description: '차량존 UUID' })
    carLocationId: string, //
  ): Promise<Car[]> {
    return this.carService.findAll({ carLocationId, page });
  }

  @Query(() => Car, { description: '차량 조회 (관리자)' })
  fetchCarWithDeleted(
    @Args('carId') carId: string, //
  ): Promise<Car> {
    return this.carService.findOneWithDeleted({ carId });
  }

  @Query(() => [Car], { description: '차량 리스트 조회 (관리자)' })
  fetchCarsWithDeleted(): Promise<Car[]> {
    return this.carService.findAllWithDeleted();
  }

  @Query(() => [PopularCarOutput], { description: '인기 차량 조회' })
  fetchPopularCars(): Promise<PopularCarOutput[]> {
    return this.carService.findPopularAll();
  }

  @Mutation(() => Car, { description: '차량 생성' })
  createCar(
    @Args('createCarInput')
    createCarInput: CreateCarInput, //
  ): Promise<Car> {
    return this.carService.create({ createCarInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '차량 삭제' })
  async deleteCar(
    @Args({ name: 'carId', description: '차량 UUID' }) carId: string,
  ): Promise<string> {
    const result = await this.carService.delete({ carId });
    if (result) return '차량이 삭제되었습니다';
    else return '삭제를 실패하였습니다';
  }

  @Mutation(() => Boolean, { description: '계약 기간 연장' })
  restoreCar(@Args('carId') carId: string): Promise<boolean> {
    return this.carService.restore({ carId });
  }
}
