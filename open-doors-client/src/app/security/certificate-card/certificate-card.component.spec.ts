import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateCardComponent } from './certificate-card.component';

describe('CertificateCardComponent', () => {
  let component: CertificateCardComponent;
  let fixture: ComponentFixture<CertificateCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificateCardComponent]
    });
    fixture = TestBed.createComponent(CertificateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
