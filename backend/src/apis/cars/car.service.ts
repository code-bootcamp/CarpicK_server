import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CarLocation } from '../carsLocation/entities/carLocation.entity';
import { CarModel } from '../carsModel/entities/carModel.entity';
import { ImageCar } from '../imagesCar/entities/imageCar.entity';
import { ImageRegistration } from '../imagesRegistration/entities/imageRegistration.entity';
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
    @InjectRepository(ImageRegistration)
    private readonly imageRegistrationRepository: Repository<ImageRegistration>,
    @InjectRepository(ImageCar)
    private readonly imageCarRepository: Repository<ImageCar>,
  ) {}

  async findAll({ carLocationId, page }) {
    const car = getConnection()
      .getRepository(Car)
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.carModel', 'carModel')
      .leftJoinAndSelect('car.carLocation', 'carLocation')
      .leftJoinAndSelect('car.reservation', 'reservation')
      .leftJoinAndSelect('car.imageCar', 'imageCar')
      .leftJoinAndSelect('car.imageRegistration', 'imageRegistration')
      .where('car.carLocationId = :carLocationId', { carLocationId })
      .orderBy('car.createdAt', 'DESC');

    if (page) {
      const result = car
        .take(10)
        .skip((page - 1) * 10)
        .getMany();
      return result;
    } else {
      const result = car.getMany();
      return result;
    }
  }

  async findOne({ carId }) {
    return await this.carRepository.findOne({
      where: { id: carId },
      relations: [
        'reservation',
        'carModel',
        'carLocation',
        'imageCar',
        'imageRegistration',
      ],
    });
  }

  async create({ createCarInput }) {
    const { carLocation, carModelName, carUrl, registrationUrl, ...car } =
      createCarInput;
    let location: CarLocation;
    const savedLocation = await this.carLocationRepository.findOne({
      address: carLocation.address,
    });
    const carModel = await this.carModelRepository.findOne({
      name: carModelName,
    });
    if (!savedLocation) {
      const newlocation = await this.carLocationRepository.save({
        ...carLocation,
      });
      location = newlocation;
    } else {
      location = savedLocation;
    }
    const savedRegistrationUrl = await this.imageRegistrationRepository.findOne(
      {
        url: registrationUrl,
      },
    );
    const savedCar = await this.carRepository.save({
      carLocation: location,
      imageRegistration: savedRegistrationUrl,
      carModel: { id: carModel.id },
      ...car,
    });
    await Promise.all(
      carUrl.map(async (address: string) => {
        const url = await this.imageCarRepository.findOne({
          url: address,
        });
        return this.imageCarRepository.save({
          ...url,
          car: { id: savedCar.id },
        });
      }),
    );
    return savedCar;
  }
}
