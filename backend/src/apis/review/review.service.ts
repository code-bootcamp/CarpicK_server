import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create({ carId, rating, currentUser }) {
    return await this.reviewRepository.save({
      car: { id: carId },
      rating,
      user: { id: currentUser.id },
    });
  }
}
