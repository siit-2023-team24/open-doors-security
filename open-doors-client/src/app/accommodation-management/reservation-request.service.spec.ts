import { TestBed } from '@angular/core/testing';

import { ReservationRequestService } from './reservation-request.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReservationRequestService', () => {
  let service: ReservationRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(ReservationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
