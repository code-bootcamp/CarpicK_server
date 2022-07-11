import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageCar } from '../imagesCar/entities/imageCar.entity';
import { CarRegistrationService } from './carRegistration.service';
import { CreateCarRegistrationInput } from './dto/createCarRegistration.input';
import { CarRegistration } from './entities/carRegistration.entity';

@Resolver()
export class CarRegistrationResolver {
  constructor(
    private readonly carRegistrationService: CarRegistrationService, //
  ) {}

  @Query(() => [CarRegistration, ImageCar])
  fetchCarRegistrations(
    @Args({ name: 'page', nullable: true, type: () => Int }) page?: number,
  ) {
    return this.carRegistrationService.findAll(page);
  }

  @Mutation(() => CarRegistration)
  createCarRegistration(
    @Args('createCarRegistrationInput')
    createCarRegistrationInput: CreateCarRegistrationInput, //
  ) {
    return this.carRegistrationService.create({ createCarRegistrationInput });
  }
}
