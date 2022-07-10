import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create({ createCarRegistrationInput }) {
    const { carUrl, registrationUrl, ...carRegistration } =
      createCarRegistrationInput;
    const result = await this.carRegistrationRepository.save({
      ...carRegistration,
      status: REGISTATION_STATUS_ENUM.IN_PROCESS,
    });
    await Promise.all(
      carUrl.map((address: string) => {
        return this.imageCarRepository.save({
          url: address,
          carRegistration: { id: result.id },
        });
      }),
    );
    this.imageRegistrationRepository.save({
      url: registrationUrl,
      carRegistration: { id: result.id },
    });
    return result;
  }
}
