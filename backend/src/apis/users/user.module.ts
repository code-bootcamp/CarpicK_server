import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { ImageReservation } from '../imagesReservation/entities/imageReservation.entity';
import { ImageReturn } from '../imagesReturn/entities/imageReturn.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ImageReservation, ImageReturn])],
  providers: [
    JwtAccessStrategy, //
    UserResolver,
    UserService,
  ],
})
export class UserModule {}
