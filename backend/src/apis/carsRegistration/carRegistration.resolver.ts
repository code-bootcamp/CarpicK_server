import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CarRegistrationService } from './carRegistration.service';
import { CreateCarRegistrationInput } from './dto/createCarRegistration.input';
import { CarRegistration } from './entities/carRegistration.entity';

@Resolver()
export class CarRegistrationResolver {
  constructor(
    private readonly carRegistrationService: CarRegistrationService, //
  ) {}

  @Query(() => CarRegistration)
  fetchCarRegistration(@Args('carRegistrationId') carRegistrationId: string) {
    return this.carRegistrationService.findOne({ carRegistrationId });
  }

  @Query(() => [CarRegistration])
  fetchCarRegistrations(
    @Args({ name: 'page', nullable: true, type: () => Int }) page?: number,
  ) {
    return this.carRegistrationService.findAll(page);
  }

  @Query(() => Int)
  fetchCarRegistrationCount() {
    return this.carRegistrationService.count();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CarRegistration)
  createCarRegistration(
    @CurrentUser('currentUser') currentUser: ICurrentUser,
    @Args('createCarRegistrationInput')
    createCarRegistrationInput: CreateCarRegistrationInput,
  ) {
    return this.carRegistrationService.create({
      currentUser,
      createCarRegistrationInput,
    });
  }

  @Mutation(() => CarRegistration)
  async updateCarRegistrationStatus(
    @Args('carRegistrationId') carRegistrationId: string,
    @Args('status') status: string,
  ) {
    return await this.carRegistrationService.update({
      carRegistrationId,
      status,
    });
  }
}
