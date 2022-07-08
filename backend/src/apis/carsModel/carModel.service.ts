import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarCategory } from '../carsCategory/entities/carCategory.entity';
import { CarModel } from './entities/carModel.entity';

@Injectable()
export class CarModelService {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>,
  ) {}

  async create({ createCarModelInput }) {
    const { carCategoryName, ...model } = createCarModelInput;
    const carCategory = await this.carCategoryRepository.findOne({
      name: carCategoryName,
    });
    return await this.carModelRepository.save({
      carCategory: { id: carCategory.id },
      ...model,
    });
  }
}
