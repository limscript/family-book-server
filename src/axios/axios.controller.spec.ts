import { Test, TestingModule } from '@nestjs/testing';
import { AxiosController } from './axios.controller';

describe('AxiosController', () => {
  let controller: AxiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AxiosController],
    }).compile();

    controller = module.get<AxiosController>(AxiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
