import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ImageCar } from '../imagesCar/entities/imageCar.entity';
import { ImageRegistration } from '../imagesRegistration/entities/imageRegistration.entity';
import { CarRegistration } from './entities/carRegistration.entity';

@Injectable()
export class CarRegistrationService {
  constructor(
    @InjectRepository(CarRegistration)
    private readonly carRegistrationRepository: Repository<CarRegistration>,
    @InjectRepository(ImageRegistration)
    private readonly imageRegistrationRepository: Repository<ImageRegistration>,
    @InjectRepository(ImageCar)
    private readonly imageCarRepository: Repository<ImageCar>,
    private readonly connection: Connection,
  ) {}

  async findOne({ carRegistrationId }) {
    return await this.carRegistrationRepository.findOne(
      { id: carRegistrationId },
      { relations: ['imageCar', 'imageRegistration', 'user'] },
    );
  }

  async findAll(page: number) {
    return await this.carRegistrationRepository.find({
      relations: ['imageCar', 'imageRegistration', 'user'],
      order: { createdAt: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });
  }

  async create({ currentUser, createCarRegistrationInput }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const { carUrl, registrationUrl, ...carRegistration } =
        createCarRegistrationInput;
      const saveRegistrationUrl = this.imageRegistrationRepository.create({
        url: registrationUrl,
      });
      await queryRunner.manager.save(saveRegistrationUrl);
      const saveCarRegistration = this.carRegistrationRepository.create({
        user: currentUser,
        imageRegistration: saveRegistrationUrl,
        ...carRegistration,
      });
      const registration = await queryRunner.manager.save(saveCarRegistration);
      await Promise.allSettled(
        carUrl.map(async (address: string) => {
          const url = this.imageCarRepository.create({
            url: address,
            carRegistration: { id: registration['id'] },
          });
          return await queryRunner.manager.save(url);
        }),
      );
      await queryRunner.commitTransaction();
      return saveCarRegistration;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async update({ carRegistrationId, status }) {
    const savedCarRegistration = await this.carRegistrationRepository.findOne({
      where: { id: carRegistrationId },
    });

    return await this.carRegistrationRepository.save({
      ...savedCarRegistration,
      id: carRegistrationId,
      status,
    });
  }

  async count() {
    return await this.carRegistrationRepository.count();
  }
}
