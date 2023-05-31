import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';

export interface TokenPayloads {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    // validate user
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await verify(user.password, password))) {
      throw new UnauthorizedException('Invalid Email or password');
    }

    //create tokens
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user),
      this.signRefreshToken(user),
    ]);

    //update user refresh token
    user.refreshToken = await hash(refresh_token);
    await user.save();

    return { access_token, refresh_token, user: new User(user.toJSON()) };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.createUser(registerDto);
    return { user: new User(user) };
  }

  async logout(user: User) {
    return this.userService.updateRefreshToken(user, null);
  }

  async getMe(user: User) {
    return { user: new User(user) };
  }

  async refreshAccessToken(user: User) {
    const access_token = await this.signAccessToken(user);
    return { access_token };
  }

  async signAccessToken(user: User) {
    return this.jwtService.signAsync(
      {
        sub: user._id,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_ACCESS_LIFETIME') || '30m',
      },
    );
  }

  async signRefreshToken(user: User) {
    return this.jwtService.signAsync(
      {
        sub: user._id,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_REFRESH_LIFETIME') || '1y',
      },
    );
  }
}
