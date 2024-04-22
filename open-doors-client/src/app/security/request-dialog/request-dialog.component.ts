import { Component, EventEmitter, Output } from '@angular/core';
import { CertificateRequestService } from '../certificate-request.service';
import { CertificateRequestApprovedDTO } from '../model/certificate-request-approved';
import { CertificateService } from '../certificate.service';

@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.css']
})
export class RequestDialogComponent {

  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  visible = false;
  userId = 0;
  selectedIssuer: string = "";

  issuers: string[] = [];

  constructor(private service: CertificateRequestService,
    private certificateService: CertificateService) {}

  ngOnInit(): void {
    this.certificateService.getIssuers().subscribe({
      next: (issuers: string[])=> {
        this.issuers = issuers;
      },
      error: () => {
        console.log("error getting issuers");
      }
    });
  }

  onCreateClick(): void {
    if (!this.selectedIssuer) return;
    let dto: CertificateRequestApprovedDTO = {userId: this.userId, issuer: this.selectedIssuer};
    
    this.service.approve(dto).subscribe({
      next: () => {
        this.visible = false;
        this.reload.emit(1);
      },
      error: (error) => {
        console.error(error.error.message);
      }
    });
  }
}
