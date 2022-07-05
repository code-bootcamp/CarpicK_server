import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateUserInput } from './dto/createUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CurrentUser } from 'src/commons/auth/gql-user.param';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(@Args('email') email: string) {
    return this.userService.findOne({ email });
  }

  @Mutation(() => Boolean)
  checkEmail(@Args('email') email: string) {
    return this.userService.checkValidationEmail({ email });
  }

  //   @Mutation(() => Boolean)
  //   checkPhone(@Args('phone') phone: string) {
  //     return phone;
  //   }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const { password, ...info } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create({ hashedPassword, ...info });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateUserPwd(
    @CurrentUser() currentUser: any, //
    @Args('password') password: string,
  ) {
    const user = await this.userService.findOne({ email: currentUser.email });
    const isAuth = await bcrypt.compare(password, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');
    const hashedPassword = await bcrypt.hash(password, 10);
    this.userService.updatePwd({ hashedPassword, currentUser });
    return 'password가 변경되었습니다.';
  }
}
