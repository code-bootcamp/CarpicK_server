import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create({
    carId,
    rating,
    currentUser,
  }: {
    carId: string;
    rating: number;
    currentUser: ICurrentUser;
  }): Promise<Review> {
    return await this.reviewRepository.save({
      car: { id: carId },
      rating,
      user: { id: currentUser.id },
    });
  }
}
