import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Request } from 'express';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const [type, token] = req.get('x-refresh')?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) return false;
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
      await this.jwtService.verifyAsync(token, { secret });
      const user = req['user'];
      if (!(await verify(user.refreshToken, token))) return false;
    } catch (error) {
      return false;
    }

    return true;
  }
}
