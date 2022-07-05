import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import * as bcrpypt from 'bcrypt';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다');
    const isAuth = await bcrpypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다');
    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: any, //
  ) {
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
        ttl: verifiedAccessToken['exp'],
      });
    } catch {
      throw new UnauthorizedException();
    }
    return '로그아웃 되었습니다';
  }
}
