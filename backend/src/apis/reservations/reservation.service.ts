import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async userFindAll({ currentUser }) {
    return await this.reservationRepository.find({
      where: { user: { id: currentUser.id } },
      relations: [
        'car',
        'car.carModel',
        'car.imageCar',
        'car.imageRegistration',
      ],
    });
  }

  async ownerFindAll({ currentUser }) {
    return await this.reservationRepository.find({
      where: { car: { ownerEmail: currentUser.email } },
      relations: [
        'car',
        'car.carModel',
        'car.imageCar',
        'car.imageRegistration',
      ],
    });
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

  async update({ reservationId, status }) {
    const teamproduct = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (status === 'CANCEL') {
      return await this.reservationRepository.save({
        ...teamproduct,
        id: reservationId,
        status: RESERVATION_STATUS_ENUM.CANCEL,
      });
    } else if (status === 'RETURN') {
      return await this.reservationRepository.save({
        ...teamproduct,
        id: reservationId,
        status: RESERVATION_STATUS_ENUM.RETURN,
      });
    } else if (status === 'USING') {
      return await this.reservationRepository.save({
        ...teamproduct,
        id: reservationId,
        status: RESERVATION_STATUS_ENUM.USING,
      });
    }
  }
}
