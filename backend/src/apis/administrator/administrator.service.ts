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

  async findOne({ adminId }: { adminId: string }): Promise<Administrator> {
    return await this.administratorRepository.findOne({ adminId });
  }

  async create({
    hashedPassword: password,
    adminId,
  }: {
    hashedPassword: string;
    adminId: string;
  }): Promise<Administrator> {
    return await this.administratorRepository.save({
      password,
      adminId,
    });
  }
}
