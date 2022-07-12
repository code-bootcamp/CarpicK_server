import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import {
  Reservation,
  RESERVATION_STATUS_ENUM,
} from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async findAll(page: number) {
    const reservation = getConnection()
      .getRepository(Reservation)
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.car', 'car')
      .leftJoinAndSelect('car.carModel', 'carModel')
      .leftJoinAndSelect('car.imageCar', 'imageCar')
      .leftJoinAndSelect('car.imageRegistration', 'imageRegistration');
    if (page) {
      const result = await reservation
        .take(10)
        .skip((page - 1) * 10)
        .getMany();
      return result;
    } else {
      const result = await reservation.getMany();
      return result;
    }
  }

  async create({ currentUser, createReservationInput }) {
    const { carId, ...reservation } = createReservationInput;
    console.log(currentUser);
    return await this.reservationRepository.save({
      user: { id: currentUser.id },
      car: { id: carId },
      ...reservation,
      status: RESERVATION_STATUS_ENUM.RESERVATION,
    });
  }
}
