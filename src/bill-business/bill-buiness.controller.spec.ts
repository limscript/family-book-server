import { Test, TestingModule } from '@nestjs/testing';
import { BillBusinessController } from './bill-business.controller';

describe('BillBusinessController', () => {
  let controller: BillBusinessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillBusinessController],
    }).compile();

    controller = module.get<BillBusinessController>(BillBusinessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
