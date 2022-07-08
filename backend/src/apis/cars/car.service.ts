import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarLocation } from '../carsLocation/entities/carLocation.entity';
import { CarModel } from '../carsModel/entities/carModel.entity';
import { Car } from './entities/car.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(CarLocation)
    private readonly carLocationRepository: Repository<CarLocation>,
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
  ) {}

  async create({ createCarInput }) {
    const { carLocation, carModelName, ...car } = createCarInput;
    const prevLocation = await this.carLocationRepository.findOne({
      address: carLocation.address,
    });
    const carModel = await this.carModelRepository.findOne({
      name: carModelName,
    });
    if (!prevLocation) {
      const newlocation = await this.carLocationRepository.save({
        ...carLocation,
      });
      return await this.carRepository.save({
        carLocation: newlocation,
        carModel: { id: carModel.id },
        ...car,
      });
    } else {
      return await this.carRepository.save({
        carLocation: prevLocation,
        carModel: { id: carModel.id },
        ...car,
      });
    }
  }
}
