import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Connection, Repository } from 'typeorm';
import { Car } from '../cars/entities/car.entity';
import { User } from '../users/entities/user.entity';
import { PaymentInput } from './dto/payment.input';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {}

  async findOne({ impUid }: { impUid: string }): Promise<Payment> {
    return await this.paymentRepository.findOne({
      impUid,
    });
  }

  async findAll({ impUid }: { impUid: string }): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { impUid },
    });
  }

  async create({
    reservationId,
    carId,
    paymentInput,
    currentUser,
  }: {
    reservationId: string;
    carId: string;
    paymentInput: PaymentInput;
    currentUser: ICurrentUser;
  }): Promise<Payment> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const payment = this.paymentRepository.create({
        ...paymentInput,
        reservation: { id: reservationId },
        user: { id: currentUser.id },
        status: PAYMENT_STATUS_ENUM.PAYMENT,
      });
      await queryRunner.manager.save(payment);

      const car = await queryRunner.manager.findOne(
        Car,
        { id: carId },
        { lock: { mode: 'pessimistic_write' }, relations: ['user'] },
      );

      const user = await queryRunner.manager.findOne(
        User,
        { id: car.user.id },
        { lock: { mode: 'pessimistic_write' } },
      );

      const updatedUser = this.userRepository.create({
        ...user,
        revenue: user.revenue + paymentInput.amount,
      });
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();
      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel({
    reservationId,
    carId,
    paymentInput,
    currentUser,
  }: {
    reservationId: string;
    carId: string;
    paymentInput: PaymentInput;
    currentUser: ICurrentUser;
  }): Promise<Payment> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const canceledPayment = this.paymentRepository.create({
        user: { id: currentUser.id },
        reservation: { id: reservationId },
        impUid: paymentInput.impUid,
        amount: -paymentInput.amount,
        paymentMethod: paymentInput.paymentMethod,
        status: PAYMENT_STATUS_ENUM.CANCLE,
      });
      await queryRunner.manager.save(canceledPayment);

      const car = await queryRunner.manager.findOne(
        Car,
        { id: carId },
        { lock: { mode: 'pessimistic_write' }, relations: ['user'] },
      );

      const user = await queryRunner.manager.findOne(
        User,
        { id: car.user.id },
        { lock: { mode: 'pessimistic_write' } },
      );

      const updatedUser = this.userRepository.create({
        ...user,
        revenue: user.revenue - paymentInput.amount,
      });
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();
      return canceledPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }
}
