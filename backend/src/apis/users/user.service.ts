import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as coolsms from 'coolsms-node-sdk';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async findUser({ email }) {
    const endTime = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.reservation', 'reservation')
      .select('reservation.endtime')
      .groupBy('reservation.endtime')
      .getRawMany();
    const availableReservation = endTime.map((el) => {
      const t2 = moment(el.endtime);
      const t1 = moment(new Date());
      return {
        entTime: el.endtime,
        diff: moment.duration(t2.diff(t1)).asMinutes(),
      };
    });
    const nearReservation = availableReservation
      .filter((n) => n.diff > 0)
      .sort((a, b) => a.diff - b.diff)[0];
    return await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.reservation', 'reservation')
      .where('user.email = :email', { email })
      .andWhere('reservation.endTime = :endTime', {
        endTime: nearReservation.entTime,
      })
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
}
