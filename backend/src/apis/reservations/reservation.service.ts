import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async userFindAll({ currentUser, page }) {
    return await this.reservationRepository.find({
      where: { user: { id: currentUser.id } },
      relations: [
        'car',
        'car.carModel',
        'car.imageCar',
        'car.imageRegistration',
      ],
      take: 10,
      skip: (page - 1) * 10,
    });
  }

  async ownerFindAll({ currentUser, page }) {
    return await this.reservationRepository.find({
      where: { car: { ownerEmail: currentUser.email } },
      relations: [
        'car',
        'car.carModel',
        'car.imageCar',
        'car.imageRegistration',
        'user',
      ],
      take: 10,
      skip: (page - 1) * 10,
    });
  }

  async create({ currentUser, createReservationInput }) {
    const { carId, ...reservation } = createReservationInput;
    console.log(currentUser);
    return await this.reservationRepository.save({
      user: { id: currentUser.id },
      car: { id: carId },
      ...reservation,
    });
  }

  async update({ reservationId, status }) {
    const savedReservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });
    return await this.reservationRepository.save({
      ...savedReservation,
      id: reservationId,
      status,
    });
  }
}
