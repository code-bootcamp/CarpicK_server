import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CarService } from './car.service';
import { CreateCarInput } from './dto/createCar.entity';
import { Car } from './entities/car.entity';

@Resolver()
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Mutation(() => Car)
  createCar(
    @Args('createCarInput')
    createCarInput: CreateCarInput, //
  ) {
    return this.carService.create({ createCarInput });
  }
}
