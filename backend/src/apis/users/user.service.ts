import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async checkValidationEmail({ email }) {
    const userEmail = await this.userRepository.findOne({ email });
    return userEmail ? false : true;
  }

  async create({ hashedPassword: password, ...info }) {
    return await this.userRepository.save({
      password,
      ...info,
    });
  }

  async updatePwd({ hashedPassword: password, currentUser }) {
    return await this.userRepository.save({
      password,
      ...currentUser,
    });
  }

  async updatePhone() {
    return 'aaa';
  }
}
