import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getRepository } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  async runEveryMinute() {
    // console.log('every 5 seconds');
    // const now = new Date();
    // const reservation = await getRepository(Reservation)
    //   .createQueryBuilder('reservation')
    //   .where('reservation.status = :using', { using: 'USING' })
    //   .andWhere('reservation.endTime < :now', { now })
    //   .getMany();
    // console.log(reservation);
  }
}
