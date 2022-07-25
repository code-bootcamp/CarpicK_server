import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AdministratorService } from './administrator.service';
import { CreateAdministratorInput } from './dto/createAdministrator.input';
import { Administrator } from './entities/administrator.entity';
import * as bcrypt from 'bcrypt';

@Resolver()
export class AdministratorResolver {
  constructor(
    private readonly administratorService: AdministratorService, //
  ) {}

  @Mutation(() => Administrator, { description: '관리자 생성' })
  async createAdministrator(
    @Args('createAdministratorInput')
    createAdministratorInput: CreateAdministratorInput, //
  ): Promise<Administrator> {
    const { password, adminId } = createAdministratorInput;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.administratorService.create({ hashedPassword, adminId });
  }
}
