import { Test, TestingModule } from '@nestjs/testing';
import { CmspageController } from './cmspage.controller';
import { CmspageService } from './cmspage.service';

describe('CmspageController', () => {
  let controller: CmspageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmspageController],
      providers: [CmspageService],
    }).compile();

    controller = module.get<CmspageController>(CmspageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
