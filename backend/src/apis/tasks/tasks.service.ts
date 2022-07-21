import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { getRepository, Repository } from 'typeorm';
import { Car } from '../cars/entities/car.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  async runEveryMinute(): Promise<void> {
    // const now = moment(new Date());
    // const startCars = await getRepository(Car)
    //   .createQueryBuilder('car')
    //   .where('car.contractStart = :now', { now })
    //   .getMany();
    // const endCars = await getRepository(Car)
    //   .createQueryBuilder('car')
    //   .where('car.contractEnd = :now', { now })
    //   .getMany();
    // await Promise.all(
    //   startCars.map(async (car) => {
    //     await this.carRepository.update({ id: car.id }, { isVaild: false });
    //     await this.carRepository.softDelete({ id: car.id });
    //     await this.carRepository.update({ id: car.id }, { isVaild: true });
    //   }),
    // );
  }
}
