import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, //
  ) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, id: user.id },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '2w' },
    );

    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/`);
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.carpick.shop; SameSite=None; Secure; httpOnly;`,
    );
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, id: user.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '1h' },
    );
  }

  async socialLogin(req, res) {
    let user = await this.userService.findOne({ email: req.user.email });
    const hashedPassword = await bcrypt.hash(req.user.password, 10);
    if (!user) {
      user = await this.userService.create({
        email: req.user.email,
        hashedPassword,
        name: req.user.name,
        phone: req.user.phone,
      });
    }
    this.setRefreshToken({ user, res });
    res.redirect('https://carpick.shop');
  }
}
