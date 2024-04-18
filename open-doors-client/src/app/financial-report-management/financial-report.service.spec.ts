import { TestBed } from '@angular/core/testing';

import { FinancialReportService } from './financial-report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FinancialReportService', () => {
  let service: FinancialReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule],});
    service = TestBed.inject(FinancialReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
