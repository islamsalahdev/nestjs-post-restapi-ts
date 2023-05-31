import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { TokenPayloads } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const [type, token] = req.headers?.authorization?.split(' ') || [];
    if (type !== 'Bearer' || !token) throw new UnauthorizedException();
    try {
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
      const { sub } = await this.jwtService.verifyAsync<TokenPayloads>(token, {
        secret,
      });
      const user = (await this.userService.getUserById(sub)).toJSON();
      if (!user) throw new UnauthorizedException();
      req['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
