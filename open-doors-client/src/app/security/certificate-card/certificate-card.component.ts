import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { CertificateDTO } from '../model/certificate';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-certificate-card',
  templateUrl: './certificate-card.component.html',
  styleUrls: ['./certificate-card.component.css']
})
export class CertificateCardComponent {
  @Input() certificate: CertificateDTO;

  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  @Output()
  onPlusClicked: EventEmitter<string> = new EventEmitter();


  constructor(private service: CertificateService,
              private dialog: MatDialog) {}

  openDeleteDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      question: "Are you sure you wish to delete the certificate with alias " + this.certificate.alias + " ?"
    }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) {
          this.service.delete(this.certificate.alias).subscribe({
            next: () => {
              console.log('Deleted certificate with alias: ' + this.certificate.alias);
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

  clickPlus() {
    this.onPlusClicked.emit(this.certificate.alias);
  }
}
