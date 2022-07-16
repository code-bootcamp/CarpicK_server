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
import { IsVaildEmail } from './dto/isValid.output';
import { CreateImageInput } from './dto/createImage.input';

@Resolver()
export class UserResolver {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly userService: UserService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(@CurrentUser() currentUser: any) {
    return this.userService.findUser({ email: currentUser.email });
  }

  @Mutation(() => IsVaildEmail)
  isValidEmail(@Args({ name: 'email', description: '이메일' }) email: string) {
    return this.userService.checkValidationEmail({ email });
  }

  @Mutation(() => String)
  async sendTokenToSMS(
    @Args({ name: 'phone', description: '전화번호' }) phone: string,
  ) {
    const token = this.userService.getToken();
    const req = await this.userService.sendToken({ phone, token });
    await this.cacheManager.set(token, phone, {
      ttl: 180,
    });
    if (req) return `{phone:${phone},token:${token}}`;
  }

  @Mutation(() => Boolean)
  async checkToken(
    @Args({ name: 'token', description: '토큰' }) token: string,
  ) {
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
    @Args({ name: 'email', description: '이메일' }) email: string, //
    @Args({ name: 'password', description: '비밀번호' }) password: string,
  ) {
    const user = await this.userService.findOne({ email });
    const isAuth = await bcrypt.compare(password, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.userService.reset({ hashedPassword, user });
    if (result) return '비밀번호가 재설정되었습니다';
    else return '재설정을 실패하였습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateUserPwd(
    @CurrentUser() currentUser: ICurrentUser,
    @Args({ name: 'password', description: '비밀번호' }) password: string,
  ) {
    const user = await this.userService.findOne({ email: currentUser.email });
    const isAuth = await bcrypt.compare(password, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.userService.updatePwd({
      hashedPassword,
      currentUser,
    });
    if (result) return '비밀번호가 변경되었습니다';
    else return '변경을 실패하였습니다.';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateUserPhone(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args({ name: 'phone', description: '전화번호' }) phone: string,
  ) {
    const user = await this.userService.findOne({ email: currentUser.email });
    if (phone === user.phone)
      throw new UnprocessableEntityException('기존 비밀번호 입니다');
    const result = await this.userService.updatePhone({ phone, currentUser });
    if (result) return '핸드폰 번호가 변경되었습니다';
    else return '변경을 실패하였습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateUserIsAuth(
    @CurrentUser() currentUser: ICurrentUser,
    @Args({ name: 'isAuth', description: '면허인증 여부' }) isAuth: boolean,
  ) {
    const result = await this.userService.updateIsAuth({ isAuth, currentUser });
    if (result) return '면허증이 등록되었습니다';
    else return '등록을 실패하였습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteLoginUser(
    @CurrentUser() currentUser: any, //
  ) {
    const result = await this.userService.deleteUser({ currentUser });
    if (result) return '로그인한 계정이 삭제되었습니다';
    else return '삭제에 실패하였습니다.';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async createImageStart(
    @Args('createImageInput') createImageInput: CreateImageInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.userService.createImageStart({
      createImageInput,
      currentUser,
    });
    if (result) return '등록 되었습니다';
    else return '등록을 실패하였습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async createImageEnd(
    @Args('createImageInput') createImageInput: CreateImageInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.userService.createImageEnd({
      createImageInput,
      currentUser,
    });
    if (result) return '반납 되었습니다';
    else return '반납을 실패하였습니다';
  }
}
