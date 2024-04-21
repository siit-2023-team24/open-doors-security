import { Component, ViewChild } from '@angular/core';
import { CertificateRequestDTO } from '../model/certificate-request';
import { MatDialog } from '@angular/material/dialog';
import { CertificateRequestService } from '../certificate-request.service';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { CertificateService } from '../certificate.service';

@Component({
  selector: 'app-certificate-requests',
  templateUrl: './certificate-requests.component.html',
  styleUrls: ['./certificate-requests.component.css']
})
export class CertificateRequestsComponent {

  @ViewChild(RequestDialogComponent) otherChild: RequestDialogComponent;
  
  requests: CertificateRequestDTO[] = [];

  constructor(private service: CertificateRequestService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (dtos: CertificateRequestDTO[]) => {
        this.requests = dtos;
      },
      error: () => {
        console.log("error getting requests");
      }
    });

    
  }

  reloadParent(id: number) {
    this.ngOnInit();
  }

  openCreateForm(id: number) {
    this.otherChild.userId = id;
    this.otherChild.visible = true;
    this.otherChild.ngOnInit();
  }

}
