import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarCategory } from '../carsCategory/entities/carCategory.entity';
import { CreateCarModelInput } from './dto/createCarModel.input';
import { CarModel } from './entities/carModel.entity';

@Injectable()
export class CarModelService {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>,
  ) {}

  async create({
    createCarModelInput,
  }: {
    createCarModelInput: CreateCarModelInput;
  }): Promise<CarModel> {
    const { carCategoryName, ...model } = createCarModelInput;
    const carCategory = await this.carCategoryRepository.findOne({
      name: carCategoryName,
    });
    return await this.carModelRepository.save({
      carCategory: { id: carCategory.id },
      ...model,
    });
  }

  async delete({ carModelId }: { carModelId: string }): Promise<boolean> {
    const result = await this.carModelRepository.delete({
      id: carModelId,
    });
    return result.affected ? true : false;
  }
}
