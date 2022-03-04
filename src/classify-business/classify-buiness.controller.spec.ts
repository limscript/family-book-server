import { Test, TestingModule } from '@nestjs/testing';
import { ClassifyBusinessController } from './classify-buiness.controller';
import { ClassifyBusinessService } from './classify-business.service';

describe('ClassifyBusinessController', () => {
  let controller: ClassifyBusinessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassifyBusinessController],
      providers: [ClassifyBusinessService],
    }).compile();

    controller = module.get<ClassifyBusinessController>(ClassifyBusinessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
