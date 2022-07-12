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

  async findOne({ carRegistrationId }) {
    return await this.carRegistrationRepository.findOne(
      { id: carRegistrationId },
      { relations: ['imageCar', 'imageRegistration', 'user'] },
    );
  }

  async findAll(page: number) {
    const registration = getConnection()
      .getRepository(CarRegistration)
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.imageCar', 'imageCar')
      .leftJoinAndSelect('registration.imageRegistration', 'imageRegistration')
      .leftJoinAndSelect('registration.user', 'user')
      .orderBy('registration.createdAt', 'DESC');

    if (page) {
      const result = await registration
        .take(10)
        .skip((page - 1) * 10)
        .getMany();
      return result;
    } else {
      const result = await registration.getMany();
      return result;
    }
  }

  async create({ currentUser, createCarRegistrationInput }) {
    const { carUrl, registrationUrl, ...carRegistration } =
      createCarRegistrationInput;
    const savedRegistrationUrl = await this.imageRegistrationRepository.save({
      url: registrationUrl,
    });
    const savedcarRegistration = await this.carRegistrationRepository.save({
      user: currentUser.id,
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

  async update({ carRegistrationId, status }) {
    const teamproduct = await this.carRegistrationRepository.findOne({
      where: { id: carRegistrationId },
    });

    if (status === 'PASS') {
      return await this.carRegistrationRepository.save({
        ...teamproduct,
        id: carRegistrationId,
        status: REGISTATION_STATUS_ENUM.PASS,
      });
    } else if (status === 'FAIL') {
      return await this.carRegistrationRepository.save({
        ...teamproduct,
        id: carRegistrationId,
        status: REGISTATION_STATUS_ENUM.FAIL,
      });
    }
  }
}
