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
import { StartCarInput } from './dto/startCar.input';
import { EndCarInput } from './dto/endCar.input';

@Resolver()
export class UserResolver {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly userService: UserService, //
  ) {}

  @Query(() => String, { description: '유저 이메일 조회' })
  async fetchEmail(
    @Args({ name: 'phone', description: '전화번호' }) phone: string,
  ): Promise<string> {
    const user = await this.userService.findEmail({ phone });
    if (user) return user.email;
    else return '등록되지 않은 번호입니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User, { description: '로그인 유저 조회' })
  fetchLoginUser(@CurrentUser() currentUser: ICurrentUser): Promise<User> {
    return this.userService.findUser({ email: currentUser.email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User, { description: '로그인 오너 조회' })
  fetchLoginOwenr(@CurrentUser() currentUser: ICurrentUser): Promise<User> {
    return this.userService.findOwner({
      id: currentUser.id,
      email: currentUser.email,
    });
  }

  @Mutation(() => IsVaildEmail, { description: '이메일 확인' })
  isValidEmail(
    @Args({ name: 'email', description: '이메일' }) email: string,
  ): Promise<IsVaildEmail> {
    return this.userService.checkValidationEmail({ email });
  }

  @Mutation(() => String, { description: '토큰 보내기' })
  async sendTokenToSMS(
    @Args({ name: 'phone', description: '전화번호' }) phone: string,
  ): Promise<string> {
    const token = this.userService.getToken();
    // const req = await this.userService.sendToken({ phone, token });
    await this.cacheManager.set(token, phone, {
      ttl: 180,
    });
    return `{phone:${phone},token:${token}}`;
    // else return '토큰 전송을 실패하였습니다';
  }

  @Mutation(() => Boolean, { description: '토큰 확인' })
  async checkToken(
    @Args({ name: 'token', description: '토큰' }) token: string,
  ): Promise<boolean> {
    const tokenCache = await this.cacheManager.get(token);
    return tokenCache ? true : false;
  }

  @Mutation(() => User, { description: '유저 생성' })
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ): Promise<User> {
    const { email, password, ...info } = createUserInput;
    const emailRegExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!emailRegExp.test(email))
      throw new UnprocessableEntityException('이메일 형식에 맞게 입력해주세요');
    if (!passwordRegExp.test(password))
      throw new UnprocessableEntityException(
        '비밀번호는 8-16자이고, 영문, 숫자가 포함되어야 합니다',
      );
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create({ email, hashedPassword, ...info });
  }

  @Mutation(() => String, { description: '비밀번호 재설정' })
  async resetPwd(
    @Args({ name: 'email', description: '이메일' }) email: string, //
    @Args({ name: 'password', description: '비밀번호' }) password: string,
  ): Promise<string> {
    const user = await this.userService.findOne({ email });
    const isAuth = await bcrypt.compare(password, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');
    const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!passwordRegExp.test(password))
      throw new UnprocessableEntityException(
        '비밀번호는 8-16자이고, 영문, 숫자가 포함되어야 합니다',
      );
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.userService.reset({ hashedPassword, user });
    if (result) return '비밀번호가 재설정되었습니다';
    else return '재설정을 실패하였습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '비밀번호 변경' })
  async updateUserPwd(
    @CurrentUser() currentUser: ICurrentUser,
    @Args({ name: 'password', description: '비밀번호' }) password: string,
  ): Promise<string> {
    const user = await this.userService.findOne({ email: currentUser.email });
    const isAuth = await bcrypt.compare(password, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');
    const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!passwordRegExp.test(password))
      throw new UnprocessableEntityException(
        '비밀번호는 8-16자이고, 영문, 숫자가 포함되어야 합니다',
      );
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.userService.updatePwd({
      hashedPassword,
      currentUser,
    });
    if (result) return '비밀번호가 변경되었습니다';
    else return '변경을 실패하였습니다.';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '핸드폰번호 변경' })
  async updateUserPhone(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args({ name: 'phone', description: '전화번호' }) phone: string,
  ): Promise<string> {
    const user = await this.userService.findOne({ email: currentUser.email });
    if (phone === user.phone)
      throw new UnprocessableEntityException('기존 전화번호 입니다');
    const result = await this.userService.updatePhone({ phone, currentUser });
    if (result) return '핸드폰 번호가 변경되었습니다';
    else return '변경을 실패하였습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '면허 업데이트' })
  async updateUserIsAuth(
    @CurrentUser() currentUser: ICurrentUser,
    @Args({ name: 'isAuth', description: '면허인증 여부' }) isAuth: boolean,
  ): Promise<string> {
    const result = await this.userService.updateIsAuth({ isAuth, currentUser });
    if (result) return '면허증이 등록되었습니다';
    else return '등록을 실패하였습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '계정 삭제' })
  async deleteLoginUser(
    @CurrentUser() currentUser: any, //
  ): Promise<string> {
    const result = await this.userService.deleteUser({ currentUser });
    if (result) return '로그인한 계정이 삭제되었습니다';
    else return '삭제에 실패하였습니다.';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '차량 이용 시작' })
  async startCar(
    @Args('startCarInput') startCarInput: StartCarInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<string> {
    const result = await this.userService.start({
      startCarInput,
      currentUser,
    });
    if (result) return '차량 이용이 시작되었습니다';
    else return '키 발급을 실패하였습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '차량 이용 종료' })
  async endCar(
    @Args('endCarInput') endCarInput: EndCarInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<string> {
    const result = await this.userService.end({
      endCarInput,
      currentUser,
    });
    if (result) return '차량 이용이 종료되었습니다';
    else return '키 반납을 실패하였습니다';
  }
}
