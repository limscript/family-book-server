import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillBusinessController } from './bill-business.controller';
import { BillBusinessService } from './bill-business.service';
import { BillBusinessEntity } from './bill-business.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BillBusinessEntity]), UserModule],
  controllers: [BillBusinessController],
  providers: [BillBusinessService],
  exports: [BillBusinessService]
})
export class BillBusinessModule { }
