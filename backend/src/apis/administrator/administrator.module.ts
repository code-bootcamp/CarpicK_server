import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministratorResolver } from './administrator.resolver';
import { AdministratorService } from './administrator.service';
import { Administrator } from './entities/administrator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Administrator])],
  providers: [
    AdministratorResolver, //
    AdministratorService,
  ],
})
export class AdministratorModule {}
