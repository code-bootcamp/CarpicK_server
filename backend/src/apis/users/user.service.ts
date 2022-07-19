import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ImageStart } from '../imagesStart/entities/imageStart.entity';
import { ImageEnd } from '../imageEnd/entities/imageEnd.entity';
import * as coolsms from 'coolsms-node-sdk';
import { IsVaildEmail } from './dto/isValid.output';
import { ICurrentUser } from 'src/commons/auth/gql-user.param';
import { StartCarInput } from './dto/startCar.input';
import { Car } from '../cars/entities/car.entity';
import { EndCarInput } from './dto/endCar.input';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(ImageStart)
    private readonly imageStartRepository: Repository<ImageStart>,
    @InjectRepository(ImageEnd)
    private readonly imageEndRepository: Repository<ImageEnd>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly connection: Connection,
  ) {}

  async findEmail({ phone }: { phone: string }): Promise<User> {
    return await this.userRepository.findOne({ phone });
  }

  async findOne({ email }: { email: string }): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findUser({ email }: { email: string }): Promise<User> {
    const now = new Date();
    return await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.reservation',
        'user.reservation',
        'reservation',
        'reservation.endTime > :now',
        { now },
      )
      .leftJoinAndSelect('reservation.car', 'car')
      .leftJoinAndSelect('car.carLocation', 'carLocation')
      .leftJoinAndSelect('car.imageCar', 'imageCar')
      .leftJoinAndSelect('car.carModel', 'carModel')
      .where('user.email = :email', { email })
      .getOne();
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
      text: `[CarpicK]
      인증번호는 ${token}입니다`,
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
  }): Promise<User> {
    return await this.userRepository.save({
      id: user.id,
      password,
    });
  }

  async updatePwd({
    hashedPassword: password,
    currentUser,
  }: {
    hashedPassword: string;
    currentUser: ICurrentUser;
  }): Promise<User> {
    return await this.userRepository.save({
      password,
      id: currentUser.id,
    });
  }

  async updatePhone({
    phone,
    currentUser,
  }: {
    phone: string;
    currentUser: ICurrentUser;
  }): Promise<User> {
    return await this.userRepository.save({
      phone,
      id: currentUser.id,
    });
  }

  async updateIsAuth({
    isAuth,
    currentUser,
  }: {
    isAuth: boolean;
    currentUser: ICurrentUser;
  }): Promise<User> {
    return await this.userRepository.save({
      isAuth,
      id: currentUser.id,
    });
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
    startCarInput,
    currentUser,
  }: {
    startCarInput: StartCarInput;
    currentUser: ICurrentUser;
  }): Promise<ImageStart[]> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const { urls, carId, reservationId } = startCarInput;
      const carFound = await queryRunner.manager.findOne(
        Car,
        { id: carId },
        { lock: { mode: 'pessimistic_write' } },
      );
      const car = this.carRepository.create({
        id: carFound.id,
        isAvailable: true,
      });
      await queryRunner.manager.save(car);
      const reservationFound = await queryRunner.manager.findOne(
        Reservation,
        { id: reservationId },
        { lock: { mode: 'pessimistic_write' } },
      );
      const reservation = this.reservationRepository.create({
        id: reservationFound.id,
        status: 'USING',
      });
      await queryRunner.manager.save(reservation);
      const startImage = await Promise.all(
        urls.map((url: string) => {
          const startUrl = this.imageStartRepository.create({
            url,
            car: { id: carId },
            user: { id: currentUser.id },
          });
          return queryRunner.manager.save(startUrl);
        }),
      );
      await queryRunner.commitTransaction();
      return startImage;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async end({
    endCarInput,
    currentUser,
  }: {
    endCarInput: EndCarInput;
    currentUser: ICurrentUser;
  }): Promise<ImageEnd[]> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const { urls, carId, reservationId } = endCarInput;
      const carFound = await queryRunner.manager.findOne(
        Car,
        { id: carId },
        { lock: { mode: 'pessimistic_write' } },
      );
      const car = this.carRepository.create({
        id: carFound.id,
        isAvailable: false,
      });
      await queryRunner.manager.save(car);
      const reservationFound = await queryRunner.manager.findOne(
        Reservation,
        { id: reservationId },
        { lock: { mode: 'pessimistic_write' } },
      );
      const reservation = this.reservationRepository.create({
        id: reservationFound.id,
        status: 'RETURN',
      });
      await queryRunner.manager.save(reservation);
      const endImage = await Promise.all(
        urls.map((url: string) => {
          const endUrl = this.imageEndRepository.create({
            url,
            car: { id: carId },
            user: { id: currentUser.id },
          });
          return queryRunner.manager.save(endUrl);
        }),
      );
      await queryRunner.commitTransaction();
      return endImage;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }
}
