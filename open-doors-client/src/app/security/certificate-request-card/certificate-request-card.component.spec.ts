import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRequestCardComponent } from './certificate-request-card.component';

describe('CertificateRequestCardComponent', () => {
  let component: CertificateRequestCardComponent;
  let fixture: ComponentFixture<CertificateRequestCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificateRequestCardComponent]
    });
    fixture = TestBed.createComponent(CertificateRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
