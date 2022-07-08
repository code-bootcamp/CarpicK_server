import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { AuthModule } from './apis/auth/auth.module';
import { CarRegistrationModule } from './apis/carsRegistration/carRegistration.module';
import { CarModule } from './apis/cars/car.module';
import { UserModule } from './apis/users/user.module';
import { AppController } from './app.controller';
import { Administrator } from './apis/administrator/entities/administrator.entity';
import { CarCategoryModule } from './apis/carsCategory/carCategory.module';
import { PaymentModule } from './apis/payments/payment.module';
import { ReservationModule } from './apis/reservations/reservation.module';
import { CarModelModule } from './apis/carsModel/carModel.module';
import { FileModule } from './apis/file/file.module';

@Module({
  imports: [
    Administrator,
    AuthModule,
    CarModule,
    CarCategoryModule,
    CarModelModule,
    CarRegistrationModule,
    FileModule,
    PaymentModule,
    ReservationModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.REDIS_URL,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
