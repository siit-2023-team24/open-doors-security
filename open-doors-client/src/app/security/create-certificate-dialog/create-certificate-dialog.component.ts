import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-certificate-dialog',
  templateUrl: './create-certificate-dialog.component.html',
  styleUrls: ['./create-certificate-dialog.component.css']
})
export class CreateCertificateDialogComponent implements OnInit{
  formData: any = {};

  constructor(private dialogRef: MatDialogRef<CreateCertificateDialogComponent>) {}

  ngOnInit(): void {}

  onSubmit(): void {
    // Here you can handle form submission, e.g., save the data
    // For demonstration purposes, just close the dialog
    this.dialogRef.close(this.formData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
