import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { User } from '../users/entities/user.entity';
import { Administrator } from '../administrator/entities/administrator.entity';
import { ICurrentAdmin } from 'src/commons/auth/gql-user.param';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, //
  ) {}

  getAccessToken({ admin }: { admin: Administrator | ICurrentAdmin }): string {
    return this.jwtService.sign(
      { email: admin.adminId, id: admin.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '1h' },
    );
  }

  getAppAccessToken({ user }: { user: User }): string {
    return this.jwtService.sign(
      { email: user.email, id: user.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '1w' },
    );
  }

  setRefreshToken({ admin, res }: { admin: Administrator; res: any }): void {
    const refreshToken = this.jwtService.sign(
      { email: admin.adminId, id: admin.id },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '2w' },
    );
    // dev
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/`);
    // deploy
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.car-pick.shop; SameSite=None; Secure; httpOnly;`,
    );
  }

  async getGoogleUser({ accessToken }: { accessToken: string }): Promise<any> {
    const userReq = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('userData==', userReq.data);
    return userReq.data;
  }

  async socialLogin({ gUser }): Promise<User> {
    let userFound = await this.userService.findOne({ email: gUser.email });
    const hashedPassword = await bcrypt.hash(gUser.id, 10);
    if (!userFound) {
      userFound = await this.userService.create({
        email: gUser.email,
        hashedPassword,
        name: gUser.name,
        phone: '01012341234',
        isAuth: false,
      });
    }
    return userFound;
  }
}
