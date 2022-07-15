import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ImageStart } from '../imagesStart/entities/imageStart.entity';
import { ImageEnd } from '../imageEnd/entities/imageEnd.entity';
import * as coolsms from 'coolsms-node-sdk';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ImageStart)
    private readonly imageStartRepository: Repository<ImageStart>,

    @InjectRepository(ImageEnd)
    private readonly imageEndRepository: Repository<ImageEnd>,
  ) {}

  async findOne({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async findUser({ email }) {
    const now = new Date();
    return await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.reservation', 'reservation')
      .where('user.email = :email', { email })
      .andWhere(
        'IF(reservation.id is null, reservation.id is null, reservation.endTime > :now)',
        {
          now,
        },
      )
      .orderBy('reservation.endTime', 'ASC')
      .limit(1)
      .getOne();
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

  async createImageStart({ createImageInput, currentUser }) {
    const { urls, carId } = createImageInput;
    return await Promise.all(
      urls.map((url: string) => {
        return this.imageStartRepository.save({
          url,
          car: { id: carId },
          user: currentUser,
        });
      }),
    );
  }

  async createImageEnd({ createImageInput, currentUser }) {
    const { urls, carId } = createImageInput;
    return await Promise.all(
      urls.map((url: string) => {
        return this.imageEndRepository.save({
          url,
          car: { id: carId },
          user: currentUser,
        });
      }),
    );
  }
}
