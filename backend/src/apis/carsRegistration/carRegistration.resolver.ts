import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CarRegistrationService } from './carRegistration.service';
import { CreateCarRegistrationInput } from './dto/createCarRegistration.input';
import { CarRegistration } from './entities/carRegistration.entity';

@Resolver()
export class CarRegistrationResolver {
  constructor(
    private readonly carRegistrationService: CarRegistrationService, //
  ) {}

  @Mutation(() => CarRegistration)
  createCarRegistration(
    @Args('createCarRegistrationInput')
    createCarRegistrationInput: CreateCarRegistrationInput, //
  ) {
    return this.carRegistrationService.create({ createCarRegistrationInput });
  }
}
