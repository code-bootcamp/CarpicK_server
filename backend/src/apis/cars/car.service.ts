import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
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
    @InjectRepository(ImageCar)
    private readonly imageCarRepository: Repository<ImageCar>,
    private readonly connection: Connection,
  ) {}

  async findAll({ carLocationId }) {
    return await this.carRepository.find({
      where: { carLocation: { id: carLocationId } },
      relations: [
        'carModel',
        'carLocation',
        'reservation',
        'imageCar',
        'imageRegistration',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne({ carId }) {
    return await this.carRepository.findOne({
      where: { id: carId },
      relations: [
        'carModel',
        'carLocation',
        'reservation',
        'imageCar',
        'imageRegistration',
      ],
    });
  }

  async create({ createCarInput }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const { carLocation, carModelName, carUrl, registrationUrl, ...car } =
        createCarInput;
      let location: CarLocation[] | CarLocation;
      const saveLocation = await queryRunner.manager.findOne(
        CarLocation,
        { address: carLocation.address },
        { lock: { mode: 'pessimistic_write' } },
      );
      const carModel = await queryRunner.manager.findOne(
        CarModel,
        { name: carModelName },
        { lock: { mode: 'pessimistic_write' } },
      );
      if (!saveLocation) {
        const newlocation = this.carLocationRepository.create({
          ...carLocation,
        });
        location = newlocation;
      } else {
        location = saveLocation;
      }
      await queryRunner.manager.save(location);
      const saveRegistrationUrl = await queryRunner.manager.findOne(
        ImageRegistration,
        { url: registrationUrl },
        { lock: { mode: 'pessimistic_write' } },
      );
      if (!saveRegistrationUrl)
        throw new UnprocessableEntityException(
          '사용자가 등록한 이미지와 다릅니다',
        );
      const CarInfo = this.carRepository.create({
        carLocation: location,
        imageRegistration: saveRegistrationUrl,
        carModel: { id: carModel.id },
        ...car,
      });
      const saveCar = await queryRunner.manager.save(CarInfo);
      await Promise.all(
        carUrl.map(async (address: string) => {
          const savedUrl = await queryRunner.manager.findOne(
            ImageCar,
            { url: address },
            { lock: { mode: 'pessimistic_write' } },
          );
          const url = this.imageCarRepository.create({
            ...savedUrl,
            car: { id: saveCar['id'] },
          });
          return await queryRunner.manager.save(url);
        }),
      );
      await queryRunner.commitTransaction();
      return saveCar;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete({ carId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const carImages = await queryRunner.manager.find(ImageCar, {
        lock: { mode: 'pessimistic_write' },
        relations: ['car'],
      });
      const filteredImages = carImages.filter(
        (image) => image.car.id === carId,
      );
      await Promise.all(
        filteredImages.map(async (image) => {
          const carImage = this.imageCarRepository.create({
            id: image.id,
            car: { id: null },
          });
          return await queryRunner.manager.save(carImage);
        }),
      );
      const result = await queryRunner.manager.softDelete(Car, { id: carId });
      await queryRunner.commitTransaction();
      return result.affected ? true : false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }
}
