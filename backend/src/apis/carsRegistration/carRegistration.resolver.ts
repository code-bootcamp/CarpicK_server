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

  @Query(() => CarRegistration, { description: '등록 차량 조회' })
  fetchCarRegistration(
    @Args({ name: 'carRegistrationId', description: '등록 차량 UUID' })
    carRegistrationId: string,
  ) {
    return this.carRegistrationService.findOne({ carRegistrationId });
  }

  @Query(() => [CarRegistration], { description: '등록 차량 리스트 조회' })
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

  @Query(() => Int, { description: '등록 차량 수' })
  fetchCarRegistrationCount() {
    return this.carRegistrationService.count();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CarRegistration, { description: '등록 차량 생성' })
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

  @Mutation(() => CarRegistration, { description: '등록 차량 상태 업데이트' })
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
