import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewService: ReviewService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review, { description: '리뷰 생성' })
  createReview(
    @CurrentUser() currentUser: ICurrentUser,
    @Args({ name: 'carId', description: '차량 UUID' }) carId: string,
    @Args({ name: 'rating', type: () => Int, description: '평점' })
    rating: number,
  ): Promise<Review> {
    return this.reviewService.create({
      carId,
      rating,
      currentUser,
    });
  }
}
