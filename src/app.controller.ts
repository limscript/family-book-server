import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('family-book')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/detail')
  getBillDetail(): any {
    return []
  }
}
