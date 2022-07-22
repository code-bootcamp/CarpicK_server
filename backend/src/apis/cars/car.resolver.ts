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
  @Mutation(() => String, { description: '계약 중지' })
  async deleteCar(
    @Args({ name: 'carId', description: '차량 UUID' }) carId: string,
  ): Promise<string> {
    const result = await this.carService.delete({ carId });
    if (result) return '계약이 중지되었습니다';
    else return '계약 중지를 실패하였습니다';
  }

  @Mutation(() => String, { description: '계약 재시작' })
  async restoreCar(@Args('carId') carId: string): Promise<string> {
    const result = await this.carService.restore({ carId });
    if (result) return '계약이 재시작되었습니다';
    else return '계약 재시작을 실패하였습니다';
  }

  @Mutation(() => String, { description: '기간 재계약' })
  async refreshContract(
    @Args('contractStart') contractStart: Date,
    @Args('contractEnd') contractEnd: Date,
    @Args('carId') carId: string,
  ): Promise<string> {
    const result = await this.carService.updateContract({
      carId,
      contractStart,
      contractEnd,
    });
    if (result) return '재계약 되었습니다';
    else return '재계약을 실패하였습니다';
  }
}
