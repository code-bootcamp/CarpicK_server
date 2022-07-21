import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { ImageStart } from '../imagesStart/entities/imageStart.entity';
import { ImageEnd } from '../imageEnd/entities/imageEnd.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { CarService } from '../cars/car.service';
import { ReservationService } from '../reservations/reservation.service';
import { Car } from '../cars/entities/car.entity';
import { CarLocation } from '../carsLocation/entities/carLocation.entity';
import { ImageCar } from '../imagesCar/entities/imageCar.entity';
import { Reservation } from '../reservations/entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ImageStart,
      ImageEnd,
      Car,
      CarLocation,
      ImageCar,
      Reservation,
    ]),
  ],
  providers: [
    JwtAccessStrategy,
    UserResolver,
    UserService,
    CarService,
    ReservationService,
  ],
})
export class UserModule {}
