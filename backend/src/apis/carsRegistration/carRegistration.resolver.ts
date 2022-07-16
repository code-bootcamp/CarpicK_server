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
  fetchCarRegistration(
    @Args({ name: 'carRegistrationId', description: '등록 차량 UUID' })
    carRegistrationId: string,
  ) {
    return this.carRegistrationService.findOne({ carRegistrationId });
  }

  @Query(() => [CarRegistration])
  fetchCarRegistrations(
    @Args({
      name: 'page',
      type: () => Int,
      defaultValue: 1,
      description: '페이지 넘버',
    })
    page: number,
  ) {
    return this.carRegistrationService.findAll({ page });
  }

  @Query(() => Int)
  fetchCarRegistrationCount() {
    return this.carRegistrationService.count();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CarRegistration)
  createCarRegistration(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createCarRegistrationInput')
    createCarRegistrationInput: CreateCarRegistrationInput,
  ) {
    return this.carRegistrationService.create({
      currentUser,
      createCarRegistrationInput,
    });
  }

  @Mutation(() => CarRegistration)
  updateCarRegistrationStatus(
    @Args({ name: 'carRegistrationId', description: '등록 차량 UUID' })
    carRegistrationId: string,
    @Args({ name: 'status', description: '심사 상태' }) status: string,
  ) {
    return this.carRegistrationService.update({
      carRegistrationId,
      status,
    });
  }
}
