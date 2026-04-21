import { Test, TestingModule } from '@nestjs/testing';
import { SupplierDashboardService } from './supplier-dashboard.service';

describe('SupplierDashboardService', () => {
  let service: SupplierDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierDashboardService],
    }).compile();

    service = module.get<SupplierDashboardService>(SupplierDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
