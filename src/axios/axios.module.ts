import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AxiosController } from './axios.controller';
import { AxiosService } from './axios.service';

@Module({
  imports: [HttpModule],
  controllers: [AxiosController],
  providers: [AxiosService],
  exports: [AxiosService]
})
export class AxiosModule { }
