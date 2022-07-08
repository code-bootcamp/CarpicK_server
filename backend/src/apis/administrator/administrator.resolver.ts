import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AdministratorService } from './administrator.service';
import { CreateAdministratorInput } from './dto/createAdministrator.input';
import { Administrator } from './entities/administrator.entity';

@Resolver()
export class AdministratorResolver {
  constructor(
    private readonly administratorService: AdministratorService, //
  ) {}

  @Mutation(() => Administrator)
  createAdministrator(
    @Args('createAdministratorInput')
    createAdministratorInput: CreateAdministratorInput, //
  ) {
    return this.administratorService.create({ createAdministratorInput });
  }
}
