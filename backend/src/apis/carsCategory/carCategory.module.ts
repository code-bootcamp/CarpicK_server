import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarCategoryResolver } from './carCategory.resolver';
import { CarCategoryService } from './carCategory.service';
import { CarCategory } from './entities/carCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarCategory])],
  providers: [
    CarCategoryResolver, //
    CarCategoryService,
  ],
})
export class CarCategoryModule {}
