import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CarModel } from '../carsModel/entities/carModel.entity';
import { CarCategory } from './entities/carCategory.entity';

@Injectable()
export class CarCategoryService {
  constructor(
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>, //
  ) {}

  async create({ createCarCategoryInput }) {
    return await this.carCategoryRepository.save({ ...createCarCategoryInput });
  }

  async findAll() {
    return await this.carCategoryRepository.find({
      relations: ['carModel'], //CarCategory??
    });
  }
}
