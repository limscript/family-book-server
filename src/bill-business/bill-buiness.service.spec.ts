import { Test, TestingModule } from '@nestjs/testing';
import { BillBusinessService } from './bill-business.service';

describe('BillBusinessService', () => {
  let service: BillBusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillBusinessService],
    }).compile();

    service = module.get<BillBusinessService>(BillBusinessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
