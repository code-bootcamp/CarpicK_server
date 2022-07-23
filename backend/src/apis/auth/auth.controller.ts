import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';

// interface IOAuthUser {
//   user: Pick<User, 'email' | 'name' | 'password' | 'phone'>;
// }

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Get('https://www.googleapis.com/oauth2/v2/userinfo')
  async loginGoogle(
    @Req() req: Request, //
  ): Promise<void> {
    console.log('reqr====', req);
    console.log('req.user====', req.user);
    // await this.authService.socialLogin(req);
  }
}
