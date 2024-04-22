import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CertificateTemplateDTO } from '../model/certificiate-template';
import { CertificateTemplateService } from '../certificate-template.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-certificate-template',
  templateUrl: './certificate-template.component.html',
  styleUrls: ['./certificate-template.component.css']
})
export class CertificateTemplateComponent {
  @Input() template: CertificateTemplateDTO;

  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  @Output()
  onApplyClicked: EventEmitter<CertificateTemplateDTO> = new EventEmitter();


  constructor(private service: CertificateTemplateService,
              private dialog: MatDialog) {}

  openDeleteDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      question: "Are you sure you want to delete the template with name " + this.template.name + "?"
    }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) {
          let that = this;
          this.service.delete(this.template.id).subscribe({
            next: () => {
              console.log('Deleted certificate with alias: ' + this.template.name);
              that.reload.emit(1);
            },
            error: (error) => {
              console.error(error.error.message);
            }
          });
        };
      }
    })
  }

  clickApply() {
    console.log(this.template);
    this.onApplyClicked.emit(this.template);
  }
}