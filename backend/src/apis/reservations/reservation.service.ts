import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
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
        'car.carLocation',
        'car.imageCar',
        'payment',
      ],
      withDeleted: true,
      order: { createdAt: 'DESC' },
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
        'car.carLocation',
        'car.imageCar',
        'user',
        'payment',
      ],
      order: { createdAt: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async create({
    currentUser,
    createReservationInput,
  }: {
    currentUser: ICurrentUser;
    createReservationInput: CreateReservationInput;
  }): Promise<Reservation> {
    const { carId, ...reservation } = createReservationInput;

    return await this.reservationRepository.save({
      user: { id: currentUser.id },
      car: { id: carId },
      ...reservation,
    });
  }

  async update({
    reservationId,
    status,
  }: {
    reservationId: string;
    status: string;
  }): Promise<boolean> {
    const result = await this.reservationRepository.update(
      { id: reservationId },
      { status },
    );
    return result.affected ? true : false;
  }
}
