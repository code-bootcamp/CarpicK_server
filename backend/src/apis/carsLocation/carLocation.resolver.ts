import { Args, Query, Resolver } from '@nestjs/graphql';
import { CarLocationService } from './carLocation.service';
import { FetchCarLocationInput } from './dto/fetchCarLocation.input';
import { CarLocation } from './entities/carLocation.entity';

@Resolver()
export class CarLocationResolver {
  constructor(
    private readonly carLocationService: CarLocationService, //
  ) {}

  @Query(() => [CarLocation], { description: '차량존 조회' })
  fetchCarLocation(
    @Args('fetchCarLocationInput') fetchCarLocationInput: FetchCarLocationInput,
  ) {
    return this.carLocationService.findAll({ fetchCarLocationInput });
  }
}
