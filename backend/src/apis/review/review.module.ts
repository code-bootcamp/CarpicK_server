import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { Review } from './entities/review.entity';
import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [
    JwtAccessStrategy, //
    ReviewResolver,
    ReviewService,
  ],
})
export class ReviewModule {}
