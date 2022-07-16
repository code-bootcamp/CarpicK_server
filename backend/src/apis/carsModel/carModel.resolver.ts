import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CarModelService } from './carModel.service';
import { CreateCarModelInput } from './dto/createCarModel.input';
import { CarModel } from './entities/carModel.entity';

@Resolver()
export class CarModelResolver {
  constructor(
    private readonly carModelService: CarModelService, //
  ) {}

  @Mutation(() => CarModel, { description: '모델 생성' })
    @Args('createCarModelInput') createCarModelInput: CreateCarModelInput, //
  ) {
    return this.carModelService.create({ createCarModelInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '모델 삭제' })
  deleteCarModel(
    @Args({ name: 'carModelId', description: '모델 UUID' }) carModelId: string, //
  ) {
    return this.carModelService.delete({ carModelId });
  }
}
