import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ImageStart } from '../imagesStart/entities/imageStart.entity';
import { ImageEnd } from '../imageEnd/entities/imageEnd.entity';
import * as coolsms from 'coolsms-node-sdk';
import { IsVaildEmail } from './dto/isValid.output';
import { ICurrentUser } from 'src/commons/auth/gql-user.param';

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

  async findEmail({ phone }: { phone: string }): Promise<User> {
    return await this.userRepository.findOne({ phone });
  }

  async findOne({ email }: { email: string }): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findUser({ email }: { email: string }): Promise<User> {
    const usingUser = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.reservation', 'reservation')
      .leftJoinAndSelect('reservation.car', 'car')
      .leftJoinAndSelect('reservation.payment', 'payment')
      .leftJoinAndSelect('car.carLocation', 'carLocation')
      .leftJoinAndSelect('car.imageCar', 'imageCar')
      .leftJoinAndSelect('car.carModel', 'carModel')
      .where('user.email = :email', { email })
      .andWhere('reservation.status = :status', { status: 'USING' })
      .getOne();

    if (usingUser) return usingUser;
    else {
      const now = new Date();
      return await getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndMapMany(
          'user.reservation',
          'user.reservation',
          'reservation',
          'reservation.endTime > :now AND reservation.status = :status',
          { now, status: 'RESERVATION' },
        )
        .leftJoinAndSelect('reservation.car', 'car')
        .leftJoinAndSelect('reservation.payment', 'payment')
        .leftJoinAndSelect('car.carLocation', 'carLocation')
        .leftJoinAndSelect('car.imageCar', 'imageCar')
        .leftJoinAndSelect('car.carModel', 'carModel')
        .where('user.email = :email', { email })
        .getOne();
    }
  }

  async findOwner({ email }: { email: string }): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
      relations: [
        'car',
        'car.carModel',
        'car.carLocation',
        'car.imageCar',
        'carRegistration',
        'carRegistration.imageCar',
      ],
    });
  }

  async checkValidationEmail({
    email,
  }: {
    email: string;
  }): Promise<IsVaildEmail> {
    const userEmail = await this.userRepository.findOne({ email });
    return {
      isValid: userEmail ? false : true,
      phone: userEmail ? userEmail.phone : '',
    };
  }

  getToken(): string {
    return String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
  }

  async sendToken({
    phone,
    token,
  }: {
    phone: string;
    token: string;
  }): Promise<coolsms.SingleMessageSentResponse> {
    const mysms = coolsms.default;
    const messageService = new mysms(
      process.env.SMS_KEY,
      process.env.SMS_SECRET,
    );
    return await messageService.sendOne({
      to: phone,
      from: process.env.SMS_SENDER,
      text: `[CarpicK] 인증번호는 ${token}입니다`,
      autoTypeDetect: true,
    });
  }

  async create({
    email,
    hashedPassword: password,
    ...info
  }: {
    email: string;
    hashedPassword: string;
    name: string;
    phone: string;
    isAuth: boolean;
  }): Promise<User> {
    return await this.userRepository.save({
      email,
      password,
      ...info,
    });
  }

  async reset({
    hashedPassword: password,
    user,
  }: {
    hashedPassword: string;
    user: User;
  }): Promise<boolean> {
    const result = await this.userRepository.update(
      { id: user.id },
      { password },
    );
    return result.affected ? true : false;
  }

  async updatePwd({
    hashedPassword: password,
    currentUser,
  }: {
    hashedPassword: string;
    currentUser: ICurrentUser;
  }): Promise<boolean> {
    const result = await this.userRepository.update(
      { id: currentUser.id },
      { password },
    );
    return result.affected ? true : false;
  }

  async updatePhone({
    phone,
    currentUser,
  }: {
    phone: string;
    currentUser: ICurrentUser;
  }): Promise<boolean> {
    const result = await this.userRepository.update(
      { id: currentUser.id },
      { phone },
    );
    return result.affected ? true : false;
  }

  async updateIsAuth({
    isAuth,
    currentUser,
  }: {
    isAuth: boolean;
    currentUser: ICurrentUser;
  }): Promise<boolean> {
    const result = await this.userRepository.update(
      { id: currentUser.id },
      { isAuth },
    );
    return result.affected ? true : false;
  }

  async deleteUser({
    currentUser,
  }: {
    currentUser: ICurrentUser;
  }): Promise<boolean> {
    const result = await this.userRepository.softDelete({
      id: currentUser.id,
    });
    return result.affected ? true : false;
  }

  async start({
    carId,
    urls,
    currentUser,
  }: {
    carId: string;
    urls: string[];
    currentUser: ICurrentUser;
  }): Promise<ImageStart[]> {
    const startImage = await Promise.all(
      urls.map((url: string) => {
        return this.imageStartRepository.save({
          url,
          car: { id: carId },
          user: { id: currentUser.id },
        });
      }),
    );
    return startImage;
  }

  async end({
    carId,
    urls,
    currentUser,
  }: {
    carId: string;
    urls: string[];
    currentUser: ICurrentUser;
  }): Promise<ImageEnd[]> {
    return await Promise.all(
      urls.map((url: string) => {
        return this.imageEndRepository.save({
          url,
          car: { id: carId },
          user: { id: currentUser.id },
        });
      }),
    );
  }
}
