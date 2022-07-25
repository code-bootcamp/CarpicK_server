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

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => CarRegistration, { description: '등록 차량 조회' })
  fetchCarRegistration(
    @Args({ name: 'carRegistrationId', description: '등록 차량 UUID' })
    carRegistrationId: string,
  ): Promise<CarRegistration> {
    return this.carRegistrationService.findOne({ carRegistrationId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [CarRegistration], { description: '등록 차량 리스트 조회' })
  fetchCarRegistrations(
    @Args({
      name: 'page',
      type: () => Int,
      nullable: true,
      description: '페이지 넘버',
    })
    page: number,
  ): Promise<CarRegistration[]> {
    return this.carRegistrationService.findAll({ page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int, { description: '등록 차량 수' })
  fetchCarRegistrationCount(): Promise<number> {
    return this.carRegistrationService.count();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CarRegistration, { description: '등록 차량 생성' })
  createCarRegistration(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createCarRegistrationInput')
    createCarRegistrationInput: CreateCarRegistrationInput,
  ): Promise<CarRegistration> {
    return this.carRegistrationService.create({
      currentUser,
      createCarRegistrationInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CarRegistration, { description: '등록 차량 상태 업데이트' })
  updateCarRegistrationStatus(
    @Args({ name: 'carRegistrationId', description: '등록 차량 UUID' })
    carRegistrationId: string,
    @Args({ name: 'status', description: '심사 상태' }) status: string,
  ): Promise<CarRegistration> {
    return this.carRegistrationService.update({
      carRegistrationId,
      status,
    });
  }
}
