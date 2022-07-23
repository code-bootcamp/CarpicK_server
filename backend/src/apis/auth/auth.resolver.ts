import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import * as bcrpypt from 'bcrypt';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { CurrentAdmin, ICurrentAdmin } from 'src/commons/auth/gql-user.param';
import { AdministratorService } from '../administrator/administrator.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly administratorService: AdministratorService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String, { description: '로그인' })
  async login(
    @Args({ name: 'email', description: '이메일' }) email: string,
    @Args({ name: 'password', description: '비밀번호' }) password: string,
  ): Promise<string> {
    const user = await this.userService.findOne({ email });
    if (!user)
      throw new UnprocessableEntityException('존재하지 않는 이메일입니다');
    const isAuth = await bcrpypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다');
    return this.authService.getAppAccessToken({ user });
  }

  @Mutation(() => String, { description: '관리자 로그인' })
  async adminLogin(
    @Args({ name: 'adminId', description: '관리자 ID' }) adminId: string,
    @Args({ name: 'password', description: '관리자 비밀번호' })
    password: string,
    @Context() context: any,
  ): Promise<string> {
    const admin = await this.administratorService.findOne({ adminId });
    if (!admin)
      throw new UnprocessableEntityException('존재하지 않는 아이디입니다');
    const isAuth = await bcrpypt.compare(password, admin.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다');
    this.authService.setRefreshToken({ admin, res: context.req.res });
    return this.authService.getAccessToken({ admin });
  }

  @Mutation(() => String, { description: '구글 로그인' })
  async googleLogin(@Context() context: any): Promise<string> {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    console.log('accessToken=', accessToken);
    const gUser = await this.authService.getGoogleUser({ accessToken });
    console.log('gUser===', gUser);
    const user = await this.authService.socialLogin({ gUser });
    console.log('user===', user);
    return this.authService.getAppAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String, { description: '엑세스 토큰 재발급' })
  restoreAccessToken(
    @CurrentAdmin() currentAdmin: ICurrentAdmin, //
  ): string {
    return this.authService.getAccessToken({ admin: currentAdmin });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '로그아웃' })
  async logout(
    @Context() context: any, //
  ): Promise<string> {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    try {
      const verifiedAccessToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_KEY,
      );
      await this.cacheManager.set(`accessToken:${accessToken}`, 'blacklist', {
        ttl: verifiedAccessToken['exp'] - verifiedAccessToken['iat'],
      });
    } catch {
      throw new UnauthorizedException();
    }
    return '로그아웃 되었습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '관리자 로그아웃' })
  async adminLogout(
    @Context() context: any, //
  ): Promise<string> {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );
    try {
      const verifiedAccessToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_KEY,
      );
      const verifiedrefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
      );
      await this.cacheManager.set(`accessToken:${accessToken}`, 'blacklist', {
        ttl: verifiedAccessToken['exp'] - verifiedAccessToken['iat'],
      });
      await this.cacheManager.set(`refreshToken:${refreshToken}`, 'blacklist', {
        ttl: verifiedrefreshToken['exp'] - verifiedrefreshToken['iat'],
      });
    } catch {
      throw new UnauthorizedException();
    }
    return '로그아웃 되었습니다';
  }
}
