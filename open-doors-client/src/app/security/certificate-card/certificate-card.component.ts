import { Component, Input } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { CertificateDTO } from '../model/certificate';

@Component({
  selector: 'app-certificate-card',
  templateUrl: './certificate-card.component.html',
  styleUrls: ['./certificate-card.component.css']
})
export class CertificateCardComponent {
  @Input() certificate: CertificateDTO;

  constructor(private certificateService: CertificateService) {}

  openDeleteDialog() {}
  openCreateDialog() {}
}
