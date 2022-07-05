import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import 'dotenv/config';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'kakao',
    });
  }

  validate(accessToken, refreshToken, profile) {
    return {
      email: profile._json.kakao_account.email,
      password: String(profile.id),
      name: profile.displayName,
      phone: '01012341234',
    };
  }
}
