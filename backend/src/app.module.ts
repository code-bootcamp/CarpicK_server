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
import { CarCategoryModule } from './apis/carsCategory/carCategory.module';
import { PaymentModule } from './apis/payments/payment.module';
import { ReservationModule } from './apis/reservations/reservation.module';
import { CarModelModule } from './apis/carsModel/carModel.module';
import { FileModule } from './apis/file/file.module';
import { LicenTruthModule } from './apis/licenTruth/licenTruth.module';
import { AdministratorModule } from './apis/administrator/administrator.module';
import { CarLocationModule } from './apis/carsLocation/carLocation.module';
import { ReviewModule } from './apis/review/review.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './apis/tasks/tasks.module';

@Module({
  imports: [
    AdministratorModule,
    AuthModule,
    CarModule,
    CarCategoryModule,
    CarLocationModule,
    CarModelModule,
    CarRegistrationModule,
    FileModule,
    LicenTruthModule,
    PaymentModule,
    ReservationModule,
    ReviewModule,
    TasksModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: [process.env.CORS_ORIGIN_DEV, process.env.CORS_ORIGIN_PROD],
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
          'Access-Control-Allow-Headers',
          'Authorization',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
        credentials: true,
      },
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
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
