import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { MaterialModule } from '../infrastucture/material/material.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { CertificatesComponent } from './certificates/certificates.component';
import { CertificateRequestsComponent } from './certificate-requests/certificate-requests.component';
import { CertificateCardComponent } from './certificate-card/certificate-card.component';
import { CreateCertificateDialogComponent } from './create-certificate-dialog/create-certificate-dialog.component';
import { CertificateTemplateComponent } from './certificate-template/certificate-template.component';
import { CertificateRequestCardComponent } from './certificate-request-card/certificate-request-card.component';
import { RequestDialogComponent } from './request-dialog/request-dialog.component';




@NgModule({
  declarations: [
    CertificatesComponent,
    CertificateRequestsComponent,
    CertificateCardComponent,
    CreateCertificateDialogComponent,
    CertificateRequestCardComponent,
    CertificateTemplateComponent,
    RequestDialogComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    CertificateCardComponent,
    CertificatesComponent,
    CertificateRequestsComponent,

  ]
})
export class SecurityModule { }
