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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Seoul',
  })
  async runEveryMinute(): Promise<void> {
    const now = moment(new Date()).format('YYYY-MM-DD');

    const startQb = getRepository(Car)
      .createQueryBuilder()
      .subQuery()
      .select([
        'car.id AS carId',
        'SUBSTR(contractStart, 1, 10) AS contractStart',
      ])
      .from(Car, 'car')
      .groupBy('car.id')
      .getQuery();

    const endQb = getRepository(Car)
      .createQueryBuilder()
      .subQuery()
      .select(['car.id AS carId', 'SUBSTR(contractEnd, 1, 10) AS contractEnd'])
      .from(Car, 'car')
      .groupBy('car.id')
      .getQuery();

    const startCars = await getRepository(Car)
      .createQueryBuilder('car')
      .leftJoinAndSelect(startQb, 'start', 'start.carId = car.id')
      .where('start.contractStart = :now', { now })
      .getMany();

    const endCars = await getRepository(Car)
      .createQueryBuilder('car')
      .leftJoinAndSelect(endQb, 'end', 'end.carId = car.id')
      .where('end.contractEnd = :now', { now })
      .getMany();

    await Promise.all(
      startCars.map(async (car) => {
        await this.carRepository.update({ id: car.id }, { isValid: true });
        return this.logger.log(`차량ID ${car.id}의 계약이 시작되었습니다`);
      }),
    );

    await Promise.all(
      endCars.map(async (car) => {
        await this.carRepository.update({ id: car.id }, { isValid: false });
        await this.carRepository.softDelete({ id: car.id });
        return this.logger.log(`차량ID ${car.id}의 계약이 종료되었습니다`);
      }),
    );
  }
}
