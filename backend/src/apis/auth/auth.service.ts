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

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, id: user.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '1m' },
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
        dob: req.user.dob,
        address: req.user.address,
      });
    }
    res.redirect(
      'http://localhost:5500/main-project/frontend/login/index.html',
    );
  }
}
