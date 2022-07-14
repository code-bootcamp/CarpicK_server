import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as coolsms from 'coolsms-node-sdk';
import { ImageReservation } from '../imagesReservation/entities/imageReservation.entity';
import { ImageReturn } from '../imagesReturn/entities/imageReturn.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ImageReservation)
    private readonly imageReservationRepository: Repository<ImageReservation>,

    @InjectRepository(ImageReturn)
    private readonly imageReturnRepository: Repository<ImageReturn>,
  ) {}

  async findOne({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async checkValidationEmail({ email }) {
    const userEmail = await this.userRepository.findOne({ email });
    const result = {
      isValid: userEmail ? false : true,
      phone: userEmail ? userEmail.phone : '',
    };
    return result;
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

  async reset({ hashedPassword: password, user }) {
    return await this.userRepository.save({
      ...user,
      password,
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

  async updateIsAuth({ isAuth, currentUser }) {
    return await this.userRepository.save({
      isAuth,
      ...currentUser,
    });
  }

  async deleteUser({ currentUser }) {
    const result = await this.userRepository.softDelete({
      id: currentUser.id,
    });
    return result.affected ? true : false;
  }

  async createImageReservation({ createImageInput, currentUser }) {
    const { urls, carId } = createImageInput;
    return await Promise.all(
      urls.map((url: string) => {
        return this.imageReservationRepository.save({
          url,
          car: { id: carId },
          user: currentUser,
        });
      }),
    );
  }

  async createImageReturn({ createImageInput, currentUser }) {
    const { urls, carId } = createImageInput;
    return await Promise.all(
      urls.map((url: string) => {
        return this.imageReturnRepository.save({
          url,
          car: { id: carId },
          user: currentUser,
        });
      }),
    );
  }
}
