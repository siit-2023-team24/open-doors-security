import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { CertificateDTO } from '../model/certificate';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit{

  certificates: CertificateDTO[] = [];

  constructor(public dialog:MatDialog,
              private certificateService: CertificateService) {}



  ngOnInit(): void {
    this.fetchCertificates();
  }

  private fetchCertificates(): void {
    this.certificateService.getCertificates().subscribe(
      (certificates: CertificateDTO[]) => {
        this.certificates = certificates;
        certificates.forEach(cert => {console.log(cert);});
      },
      error => {
        console.error("Error fetching certs: ", error);
      }
    );
  }

  public openCreateCertificateDialog(): void {}
  

}
