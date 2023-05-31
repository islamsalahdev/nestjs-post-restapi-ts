import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { CurrentUser, Public } from '../common';
import { User } from '../user/user.schema';
import { JwtRefreshGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user);
  }

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return this.authService.getMe(user);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refreshAccessToken(@CurrentUser() user: User) {
    return this.authService.refreshAccessToken(user);
  }
}
