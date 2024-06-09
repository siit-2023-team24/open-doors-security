import { TestBed } from '@angular/core/testing';

import { CertificateTemplateService } from './certificate-template.service';

describe('CertificateTemplateService', () => {
  let service: CertificateTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
