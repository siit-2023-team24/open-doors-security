import { TestBed } from '@angular/core/testing';

import { UserReportService } from './user-report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserReportService', () => {
  let service: UserReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule],});
    service = TestBed.inject(UserReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
