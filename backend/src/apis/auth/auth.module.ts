import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { AdministratorService } from '../administrator/administrator.service';
import { User } from '../users/entities/user.entity';
import { Administrator } from '../administrator/entities/administrator.entity';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User, Administrator]),
  ],
  providers: [
    JwtGoogleStrategy, //
    JwtRefreshStrategy,
    AuthResolver,
    AuthService,
    UserService,
    AdministratorService,
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
