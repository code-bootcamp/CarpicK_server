import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import 'dotenv/config';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any): Promise<any> {
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    const isLogout = await this.cacheManager.get(`accessToken:${accessToken}`);
    if (isLogout) throw new UnauthorizedException();
    return {
      email: payload.email,
      id: payload.id,
    };
  }
}
