import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrator } from './entities/administrator.entity';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>, //
  ) {}

  async findOne({ adminId }) {
    return await this.administratorRepository.findOne({ adminId });
  }

  async create({ createAdministratorInput }) {
    return await this.administratorRepository.save({
      ...createAdministratorInput,
    });
  }
}
