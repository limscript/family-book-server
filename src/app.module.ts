import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ClassifyModule } from './classify/classify.module';
import { ClassifyBusinessModule } from './classify-business/classify-business.module';
import { BillBusinessModule } from './bill-business/bill-business.module';
import { AxiosModule } from './axios/axios.module';

@Module({
  imports: [TypeOrmModule.forRoot(), ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'static'),
  }), UserModule, ClassifyModule, ClassifyBusinessModule, BillBusinessModule, AxiosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
