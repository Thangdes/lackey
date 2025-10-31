import { Test, TestingModule } from '@nestjs/testing';
import { SupplierDashboardController } from './supplier-dashboard.controller';

describe('SupplierDashboardController', () => {
  let controller: SupplierDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierDashboardController],
    }).compile();

    controller = module.get<SupplierDashboardController>(SupplierDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
