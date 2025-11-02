import { Test, TestingModule } from '@nestjs/testing';
import { CmspageService } from './cmspage.service';

describe('CmspageService', () => {
  let service: CmspageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmspageService],
    }).compile();

    service = module.get<CmspageService>(CmspageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
