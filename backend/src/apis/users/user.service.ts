import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as coolsms from 'coolsms-node-sdk';

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

  getToken() {
    return String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
  }

  async sendToken({ phone, token }) {
    const mysms = coolsms.default;
    const messageService = new mysms(
      process.env.SMS_KEY,
      process.env.SMS_SECRET,
    );
    await messageService.sendOne({
      to: phone,
      from: process.env.SMS_SENDER,
      text: `[CarpicK]
      인증번호는 ${token}입니다`,
      autoTypeDetect: true,
    });
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

  async updatePhone({ phone, currentUser }) {
    return await this.userRepository.save({
      phone,
      ...currentUser,
    });
  }
}
