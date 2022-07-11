import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { ImageCar } from '../imagesCar/entities/imageCar.entity';
import { ImageRegistration } from '../imagesRegistration/entities/imageRegistration.entity';
import {
  CarRegistration,
  REGISTATION_STATUS_ENUM,
} from './entities/carRegistration.entity';

@Injectable()
export class CarRegistrationService {
  constructor(
    @InjectRepository(CarRegistration)
    private readonly carRegistrationRepository: Repository<CarRegistration>,
    @InjectRepository(ImageRegistration)
    private readonly imageRegistrationRepository: Repository<ImageRegistration>,
    @InjectRepository(ImageCar)
    private readonly imageCarRepository: Repository<ImageCar>,
  ) {}

  async findAll(page: number) {
    const registration = getConnection()
      .getRepository(CarRegistration)
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.imageCar', 'imageCar')
      .leftJoinAndSelect('registration.imageRegistration', 'imageRegistration')
      .orderBy('registration.createdAt', 'DESC');

    if (page) {
      const result = registration
        .take(10)
        .skip((page - 1) * 10)
        .getMany();
      return result;
    } else {
      const result = registration.getMany();
      return result;
    }
  }

  async create({ createCarRegistrationInput }) {
    const { carUrl, registrationUrl, ...carRegistration } =
      createCarRegistrationInput;
    const savedRegistrationUrl = await this.imageRegistrationRepository.save({
      url: registrationUrl,
    });
    const savedcarRegistration = await this.carRegistrationRepository.save({
      imageRegistration: savedRegistrationUrl,
      ...carRegistration,
      status: REGISTATION_STATUS_ENUM.IN_PROCESS,
    });
    await Promise.all(
      carUrl.map((address: string) => {
        return this.imageCarRepository.save({
          url: address,
          carRegistration: { id: savedcarRegistration.id },
        });
      }),
    );
    return savedcarRegistration;
  }
}
