import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { Payment } from '../payments/entities/payment.entity';
import { CreateReservationInput } from './dto/createReservation';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async findOne({
    reservationId,
  }: {
    reservationId: string;
  }): Promise<Reservation> {
    return await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['car'],
    });
  }

  async userFindAll({
    currentUser,
    page,
  }: {
    currentUser: ICurrentUser;
    page: number;
  }): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { user: { id: currentUser.id } },
      relations: [
        'car',
        'car.carModel',
        'car.imageCar',
        'car.imageRegistration',
        'payment',
      ],
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async ownerFindAll({
    currentUser,
    page,
  }: {
    currentUser: ICurrentUser;
    page: number;
  }): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { car: { user: { id: currentUser.id } } },
      relations: [
        'car',
        'car.carModel',
        'car.imageCar',
        'car.imageRegistration',
        'user',
        'payment',
      ],
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async create({
    payment,
    currentUser,
    createReservationInput,
  }: {
    payment: Payment;
    currentUser: ICurrentUser;
    createReservationInput: CreateReservationInput;
  }): Promise<Reservation> {
    const { carId, ...reservation } = createReservationInput;
    return await this.reservationRepository.save({
      user: { id: currentUser.id },
      car: { id: carId },
      payment,
      ...reservation,
    });
  }

  async update({
    reservationId,
  }: {
    reservationId: string;
  }): Promise<Reservation> {
    const savedReservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });
    return await this.reservationRepository.save({
      id: savedReservation.id,
      status: 'CANCLE',
    });
  }
}
