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
    private readonly reservationRepository: Repository<Reservation>, //
  ) {}

  async create({ createReservationInput }) {
    const { carId, ...reservation } = createReservationInput;
    return await this.reservationRepository.save({
      car: { id: carId },
      ...reservation,
      status: RESERVATION_STATUS_ENUM.RESERVATION,
    });
  }
}
