import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassifyController } from './classify.controller';
import { ClassifyService } from './classify.service';
import { ClassifyEntity } from './classify.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassifyEntity])],
  controllers: [ClassifyController],
  providers: [ClassifyService],
  exports: [ClassifyService]
})
export class ClassifyModule { }
