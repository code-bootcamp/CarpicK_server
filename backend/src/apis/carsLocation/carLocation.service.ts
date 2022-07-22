import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { FetchCarLocationInput } from './dto/fetchCarLocation.input';
import { CarLocation } from './entities/carLocation.entity';

@Injectable()
export class CarLocationService {
  async findAll({
    fetchCarLocationInput,
  }: {
    fetchCarLocationInput: FetchCarLocationInput;
  }): Promise<CarLocation[]> {
    const { southWestLng, northEastLng, southWestLat, northEastLat, filter } =
      fetchCarLocationInput;
    const location = getRepository(CarLocation)
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.car', 'car')
      .leftJoinAndSelect(
        'car_model',
        'car_model',
        'car_model.id = car.carModelId',
      )
      .where('car.isValid = :isValid', { isValid: true })
      .andWhere(`lat BETWEEN ${southWestLat} AND ${northEastLat}`)
      .andWhere(`lng BETWEEN ${southWestLng} AND ${northEastLng}`);
    if (filter) {
      return await location
        .andWhere('car_model.name IN (:...names)', {
          names: filter,
        })
        .getMany();
    } else {
      return await location.getMany();
    }
  }
}
