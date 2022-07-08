import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CarRegistration,
  REGISTATION_STATUS_ENUM,
} from './entities/carRegistration.entity';

@Injectable()
export class CarRegistrationService {
  constructor(
    @InjectRepository(CarRegistration)
    private readonly carRegistrationRepository: Repository<CarRegistration>, //
  ) {}

  async create({ createCarRegistrationInput }) {
    return await this.carRegistrationRepository.save({
      ...createCarRegistrationInput,
      status: REGISTATION_STATUS_ENUM.IN_PROCESS,
    });
  }
}
