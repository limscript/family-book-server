import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassifyBusinessService } from './classify-business.service';
import { ClassifyBusinessController } from './classify-buiness.controller';
import { ClassifyBusinessEntity } from './classify-business.entity';
import { ClassifyModule } from '../classify/classify.module';
import { BillBusinessModule } from '../bill-business/bill-business.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClassifyBusinessEntity]), ClassifyModule, BillBusinessModule],
  controllers: [ClassifyBusinessController],
  providers: [ClassifyBusinessService],
})
export class ClassifyBusinessModule { }
