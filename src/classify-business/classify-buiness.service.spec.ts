import { Test, TestingModule } from '@nestjs/testing';
import { ClassifyBusinessService } from './classify-business.service';

describe('ClassifyBusinessService', () => {
  let service: ClassifyBusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassifyBusinessService],
    }).compile();

    service = module.get<ClassifyBusinessService>(ClassifyBusinessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
