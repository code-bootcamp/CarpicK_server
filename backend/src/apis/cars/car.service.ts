import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { CarLocation } from '../carsLocation/entities/carLocation.entity';
import { CarModel } from '../carsModel/entities/carModel.entity';
import { ImageCar } from '../imagesCar/entities/imageCar.entity';
import { ImageRegistration } from '../imagesRegistration/entities/imageRegistration.entity';
import { CreateCarInput } from './dto/createCar.input';
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

  async findOne({ carId }: { carId: string }): Promise<Car> {
    const now = new Date();
    return await getRepository(Car)
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.carModel', 'carModel')
      .leftJoinAndSelect('car.carLocation', 'carLocation')
      .leftJoinAndSelect('car.reservation', 'reservation')
      .leftJoinAndSelect('car.imageCar', 'imageCar')
      .leftJoinAndSelect('car.imageRegistration', 'imageRegistration')
      .where('car.id = :id', { id: carId })
      .andWhere(
        'IF(reservation.id is null, reservation.id is null, reservation.endTime > :now)',
        {
          now,
        },
      )
      .getOne();
  }

  async findAll({
    carLocationId,
    page,
  }: {
    carLocationId: string;
    page: number;
  }): Promise<Car[]> {
    const now = new Date();
    return await getRepository(Car)
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.carModel', 'carModel')
      .leftJoinAndSelect('car.carLocation', 'carLocation')
      .leftJoinAndSelect('car.reservation', 'reservation')
      .leftJoinAndSelect('car.imageCar', 'imageCar')
      .leftJoinAndSelect('car.imageRegistration', 'imageRegistration')
      .where('carLocation.id = :id', { id: carLocationId })
      .andWhere(
        'IF(reservation.id is null, reservation.id is null, reservation.endTime > :now)',
        {
          now,
        },
      )
      .orderBy('car.createdAt', 'DESC')
      .take(10)
      .skip((page - 1) * 10)
      .getMany();
  }

  async findPopularAll(): Promise<any[]> {
    const avg = await getRepository(Car)
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.review', 'review')
      .select('car.id')
      .addSelect('AVG(review.rating)', 'avg')
      .groupBy('car.id')
      .take(10)
      .orderBy('avg', 'DESC')
      .getRawMany();
    const popularCar = await Promise.all(
      avg.map((el) => {
        const car = this.carRepository.findOne({
          where: { id: el.car_id },
          relations: [
            'carModel',
            'carLocation',
            'reservation',
            'imageCar',
            'imageRegistration',
          ],
        });
        car['rating'] = el.avg;
        return car;
      }),
    );
    return popularCar;
  }

  async create({
    createCarInput,
  }: {
    createCarInput: CreateCarInput;
  }): Promise<Car> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const {
        userId,
        carLocation,
        carModelName,
        carUrl,
        registrationUrl,
        ...car
      } = createCarInput;
      let location: CarLocation;
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
        carLocation: { id: location.id },
        imageRegistration: { id: saveRegistrationUrl.id },
        carModel: { id: carModel.id },
        user: { id: userId },
        ...car,
      });
      const saveCar = await queryRunner.manager.save(CarInfo);
      await Promise.all(
        carUrl.map((address: string) => {
          const savedUrl = queryRunner.manager.findOne(
            ImageCar,
            { url: address },
            { lock: { mode: 'pessimistic_write' } },
          );
          const url = this.imageCarRepository.create({
            ...savedUrl,
            car: { id: saveCar['id'] },
          });
          return queryRunner.manager.save(url);
        }),
      );
      await queryRunner.commitTransaction();
      return CarInfo;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete({ carId }: { carId: string }): Promise<boolean> {
    const result = await this.carRepository.softDelete({ id: carId });
    return result.affected ? true : false;
  }
}
