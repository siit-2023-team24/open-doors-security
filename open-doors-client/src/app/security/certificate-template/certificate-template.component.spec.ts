import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateTemplateComponent } from './certificate-template.component';

describe('CertificateTemplateComponent', () => {
  let component: CertificateTemplateComponent;
  let fixture: ComponentFixture<CertificateTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificateTemplateComponent]
    });
    fixture = TestBed.createComponent(CertificateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
