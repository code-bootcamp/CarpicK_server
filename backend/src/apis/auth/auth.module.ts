import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { AdministratorService } from '../administrator/administrator.service';
import { User } from '../users/entities/user.entity';
import { Administrator } from '../administrator/entities/administrator.entity';
import { UserService } from '../users/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { ImageStart } from '../imagesStart/entities/imageStart.entity';
import { ImageEnd } from '../imageEnd/entities/imageEnd.entity';
import { Car } from '../cars/entities/car.entity';
import { Reservation } from '../reservations/entities/reservation.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User,
      Administrator,
      ImageStart,
      ImageEnd,
      Car,
      Reservation,
    ]),
  ],
  providers: [
    JwtRefreshStrategy,
    AuthResolver,
    AuthService,
    UserService,
    AdministratorService,
  ],
})
export class AuthModule {}
