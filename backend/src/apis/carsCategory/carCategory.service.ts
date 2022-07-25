import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarCategoryInput } from './dto/createCarCategory.input';
import { CarCategory } from './entities/carCategory.entity';

@Injectable()
export class CarCategoryService {
  constructor(
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>, //
  ) {}

  async create({
    createCarCategoryInput,
  }: {
    createCarCategoryInput: CreateCarCategoryInput;
  }): Promise<CarCategory> {
    return await this.carCategoryRepository.save({ ...createCarCategoryInput });
  }

  async findAll(): Promise<CarCategory[]> {
    return await this.carCategoryRepository.find({
      relations: ['carModel'],
    });
  }

  async delete({ carCategoryId }: { carCategoryId: string }): Promise<boolean> {
    const result = await this.carCategoryRepository.delete({
      id: carCategoryId,
    });
    return result.affected ? true : false;
  }
}
