import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificatesComponent } from './certificates/certificates.component';
import { CertificateRequestsComponent } from './certificate-requests/certificate-requests.component';
import { CertificateCardComponent } from './certificate-card/certificate-card.component';



@NgModule({
  declarations: [
    CertificatesComponent,
    CertificateRequestsComponent,
    CertificateCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SecurityModule { }
