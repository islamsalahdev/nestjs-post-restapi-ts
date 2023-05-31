import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common';

@Controller('healthz')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  healthz(): string {
    return this.appService.healthz();
  }
}
