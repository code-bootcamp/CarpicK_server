import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Connection, Repository } from 'typeorm';
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

  async create({
    paymentInput,
    currentUser,
  }: {
    paymentInput: PaymentInput;
    currentUser: ICurrentUser;
  }): Promise<Payment> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const payment = this.paymentRepository.create({
        ...paymentInput,
        user: { id: currentUser.id },
        status: PAYMENT_STATUS_ENUM.PAYMENT,
      });
      await queryRunner.manager.save(payment);
      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );
      const updatedUser = this.userRepository.create({
        ...user,
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

  async findOne({ impUid }: { impUid: string }): Promise<Payment> {
    return await this.paymentRepository.findOne({
      impUid,
    });
  }

  async cancel({
    paymentInput,
    currentUser,
  }: {
    paymentInput: PaymentInput;
    currentUser: ICurrentUser;
  }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const canceledPayment = this.paymentRepository.create({
        user: { id: currentUser.id },
        impUid: paymentInput.impUid,
        amount: -paymentInput.amount,
        paymentMethod: paymentInput.paymentMethod,
        status: PAYMENT_STATUS_ENUM.CANCLE,
      });
      await queryRunner.manager.save(canceledPayment);
      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );
      const updatedUser = this.userRepository.create({
        ...user,
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
