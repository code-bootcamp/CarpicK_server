import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { ReviewService } from './review.service';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewService: ReviewService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard) // 방어막
  @Mutation(() => String)
  async createReview(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('carId') carId: string,
    @Args('rating') rating: number,
  ) {
    const result = this.reviewService.create({
      carId,
      rating,
      currentUser,
    });
    if (result) return '리뷰가 등록되었습니다';
  }
}
