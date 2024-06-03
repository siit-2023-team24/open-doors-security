import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CertificateRequestDTO } from '../model/certificate-request';
import { CertificateRequestService } from '../certificate-request.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-certificate-request-card',
  templateUrl: './certificate-request-card.component.html',
  styleUrls: ['./certificate-request-card.component.css']
})
export class CertificateRequestCardComponent {


  @Input()
  request: CertificateRequestDTO;

  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  @Output()
  onPlusClicked: EventEmitter<string> = new EventEmitter();

  
  constructor(private service: CertificateRequestService,
    private dialog: MatDialog) {}


  openApproveDialog() {
    this.onPlusClicked.emit(this.request.userId);
  }


  openDenyDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      question: "Are you sure you wish to deny the certificate request for user " + this.request.userId + " ?"
    }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) {
          this.service.deny(this.request.userId).subscribe({
            next: () => {
              console.log('Denied certificate request for: ' + this.request.userId);
              this.reload.emit(1);
            },
            error: (error) => {
              console.error(error.error.message);
            }
          });
        };
      }
    })
  }


}
