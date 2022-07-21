import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Connection, getRepository, Repository } from 'typeorm';
import { CarLocation } from '../carsLocation/entities/carLocation.entity';
import { CarModel } from '../carsModel/entities/carModel.entity';
import { ImageCar } from '../imagesCar/entities/imageCar.entity';
import { ImageRegistration } from '../imagesRegistration/entities/imageRegistration.entity';
import { Review } from '../review/entities/review.entity';
import { CreateCarInput } from './dto/createCar.input';
import { PopularCarOutput } from './dto/popularCar.output';
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
      .leftJoinAndMapMany(
        'car.reservation',
        'car.reservation',
        'reservation',
        'reservation.endTime > :now',
        { now },
      )
      .leftJoinAndSelect('car.carModel', 'carModel')
      .leftJoinAndSelect('car.carLocation', 'carLocation')
      .leftJoinAndSelect('car.imageCar', 'imageCar')
      .where('car.id = :id', { id: carId })
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
      .leftJoinAndMapMany(
        'car.reservation',
        'car.reservation',
        'reservation',
        'reservation.endTime > :now',
        { now },
      )
      .leftJoinAndSelect('car.carModel', 'carModel')
      .leftJoinAndSelect('car.carLocation', 'carLocation')
      .leftJoinAndSelect('car.imageCar', 'imageCar')
      .where('carLocation.id = :id', { id: carLocationId })
      .orderBy('car.createdAt', 'DESC')
      .take(10)
      .skip(page ? (page - 1) * 10 : 0)
      .getMany();
  }

  async findPopularAll(): Promise<PopularCarOutput[]> {
    const review = getRepository(Review)
      .createQueryBuilder()
      .subQuery()
      .select([
        'review.carId AS carId',
        'COUNT(review.id) AS reviewNum',
        'ROUND(AVG(review.rating),2) AS avg',
      ])
      .from(Review, 'review')
      .groupBy('review.carId')
      .getQuery();
    return await getRepository(Car)
      .createQueryBuilder('car')
      .leftJoin(review, 'review', 'review.carId = car.id')
      .leftJoinAndSelect('car.user', 'user')
      .leftJoinAndSelect('car.carModel', 'carModel')
      .leftJoinAndSelect('car.carLocation', 'carLocation')
      .select([
        'car.id AS id',
        'user.name AS ownerName',
        'car.carNumber AS carNumber',
        'car.price AS price',
        'car.oil AS oil',
        'carModel.name AS carModel',
        'carLocation.addressDetail AS addressDetail',
        'IFNULL(review.reviewNum,0) AS num',
        'IFNULL(review.avg,0) AS rating',
      ])
      .take(10)
      .orderBy('avg', 'DESC')
      .getRawMany();
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
        contractStart,
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
      const now = moment(new Date());
      const start = moment(contractStart);
      const CarInfo = this.carRepository.create({
        carLocation: { id: location.id },
        imageRegistration: { id: saveRegistrationUrl.id },
        carModel: { id: carModel.id },
        user: { id: userId },
        isVaild: moment.duration(now.diff(start)).asHours() > 0 ? true : false,
        contractStart,
        ...car,
      });
      await queryRunner.manager.save(CarInfo);
      await Promise.all(
        carUrl.map(async (address: string) => {
          const savedUrl = await queryRunner.manager.findOne(
            ImageCar,
            { url: address },
            { lock: { mode: 'pessimistic_write' } },
          );
          const url = this.imageCarRepository.create({
            ...savedUrl,
            car: { id: CarInfo.id },
          });
          return await queryRunner.manager.save(url);
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

  async update({
    carId,
    isAvailable,
  }: {
    carId: string;
    isAvailable: boolean;
  }): Promise<boolean> {
    const result = await this.carRepository.update(
      { id: carId },
      { isAvailable },
    );
    return result.affected ? true : false;
  }
}
