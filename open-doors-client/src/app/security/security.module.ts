import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificatesComponent } from './certificates/certificates.component';
import { CertificateRequestsComponent } from './certificate-requests/certificate-requests.component';



@NgModule({
  declarations: [
    CertificatesComponent,
    CertificateRequestsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SecurityModule { }
