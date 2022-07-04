import { Query, Resolver } from '@nestjs/graphql';
import { CarService } from './car.service';

@Resolver()
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Query(() => String)
  getTest() {
    return this.carService.test();
  }
}
