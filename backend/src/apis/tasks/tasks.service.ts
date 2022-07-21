import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Car } from '../cars/entities/car.entity';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  async runEveryMinute() {
    console.log('every 5 seconds');
    // const now = new Date();
    // const car = await this.carRepository.find({
    //   where: { isVaild: false },
    // });
    // await Promise.all(
    //   car.map()
    // )
  }
}
