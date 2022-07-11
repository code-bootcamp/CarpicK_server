import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CarLocation } from './entities/carLocation.entity';

@Injectable()
export class CarLocationService {
  constructor(
    @InjectRepository(CarLocation)
    private readonly carLocationRepository: Repository<CarLocation>, //
  ) {}

  findAll({ fetchCarLocationInput }) {
    const { lng, lat, filter } = fetchCarLocationInput;
    const location = getConnection()
      .getRepository(CarLocation)
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.car', 'car')
      .leftJoinAndSelect(
        'car_model',
        'car_model',
        'car_model.id = car.carModelId',
      )
      .where('car_model.name IN (:...names)', { names: filter })
      .getMany();
    return location;
  }
}
