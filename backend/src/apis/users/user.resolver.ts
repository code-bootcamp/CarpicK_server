import {
  CACHE_MANAGER,
  Inject,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateUserInput } from './dto/createUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Cache } from 'cache-manager';

@Resolver()
export class UserResolver {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly userService: UserService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchLoginUser(@Args('email') email: string) {
    return await this.userService.findOne({ email });
  }

  @Mutation(() => Boolean)
  checkEmail(@Args('email') email: string) {
    return this.userService.checkValidationEmail({ email });
  }

  @Mutation(() => String)
  async sendTokenToSMS(@Args('phone') phone: string) {
    const token = this.userService.getToken();
    this.userService.sendToken({ phone, token });
    await this.cacheManager.set(token, phone, {
      ttl: 180,
    });
    return `${phone}으로 인증번호 ${token}을 전송하였습니다`;
  }

  @Mutation(() => Boolean)
  async checkToken(@Args('token') token: string) {
    const tokenCache = await this.cacheManager.get(token);
    return tokenCache ? true : false;
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const { password, ...info } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create({ hashedPassword, ...info });
  }

  @Mutation(() => String)
  async resetPwd(
    @Args('email') email: string, //
    @Args('password') password: string,
  ) {
    const user = await this.userService.findOne({ email });
    const isAuth = await bcrypt.compare(password, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');
    const hashedPassword = await bcrypt.hash(password, 10);
    this.userService.reset({ hashedPassword, user });
    return '비밀번호가 변경되었습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateUserPwd(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('password') password: string,
  ) {
    const user = await this.userService.findOne({ email: currentUser.email });
    const isAuth = await bcrypt.compare(password, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');
    const hashedPassword = await bcrypt.hash(password, 10);
    this.userService.updatePwd({ hashedPassword, currentUser });
    return '비밀번호가 변경되었습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateUserPhone(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('phone') phone: string,
  ) {
    const user = await this.userService.findOne({ email: currentUser.email });
    if (phone === user.phone)
      throw new UnprocessableEntityException('기존 비밀번호 입니다');
    this.userService.updatePhone({ phone, currentUser });
    return '핸드폰 번호가 변경되었습니다';
  }
}
