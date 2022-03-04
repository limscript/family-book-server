import { Controller, Get, Body  } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Controller('axios')
export class AxiosController {
  constructor(private readonly axiosService: AxiosService) {}

  // @Get('/get')
  // get(@Body() body) {
  //   return this.axiosService.get(body.url, body.data);
  // }

}
