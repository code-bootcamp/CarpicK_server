import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { CarLocation } from './entities/carLocation.entity';

@Injectable()
export class CarLocationService {
  async findAll({ fetchCarLocationInput }) {
    const { southWestLng, northEastLng, southWestLat, northEastLat, filter } =
      fetchCarLocationInput;
    const location = getConnection()
      .getRepository(CarLocation)
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.car', 'car')
      .leftJoinAndSelect(
        'car_model',
        'car_model',
        'car_model.id = car.carModelId',
      )
      .where(`lat BETWEEN ${southWestLat} AND ${northEastLat}`)
      .andWhere(`lng BETWEEN ${southWestLng} AND ${northEastLng}`);
    if (filter) {
      const result = await location
        .andWhere('car_model.name IN (:...names)', {
          names: filter,
        })
        .getMany();
      return result;
    } else {
      const result = await location.getMany();
      return result;
    }
  }
}
