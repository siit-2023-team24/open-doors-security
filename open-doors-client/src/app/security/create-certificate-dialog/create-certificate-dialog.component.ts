import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CertificateService } from '../certificate.service';
import { CertificateNewDTO } from '../model/certificate-new';

function dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('expirationDate')?.value;

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return { 'dateInvalid': true };
  }
  
  return null;
}

@Component({
  selector: 'app-create-certificate-dialog',
  templateUrl: './create-certificate-dialog.component.html',
  styleUrls: ['./create-certificate-dialog.component.css', '../../../styles.css']
})
export class CreateCertificateDialogComponent implements OnInit{

  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  aliases: string[];

  certificateForm: FormGroup;
  visible = false;
  issuer = "";
  errorMessage = "";
  dateValidator = false;

  constructor(private formBuilder: FormBuilder,
              private service: CertificateService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.certificateForm = this.formBuilder.group({
      issuerAlias:  [{ value: this.issuer, disabled: true }],
      alias: ['', Validators.required],
      ca: [false],
      startDate: [null, Validators.required],
      expirationDate: [null, Validators.required],
      commonName: ['', Validators.required],
      organization: ['', Validators.required],
      organizationalUnit: ['', Validators.required],
      locality: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', Validators.required],
      usage: ['']
    }, { validator: dateValidator });
  }

  onCreateClick(): void {
    console.log(this.dateValidator)
    this.errorMessage = 'Please fill out all the fields according to the validations.'
    if(this.certificateForm.value.startDate && 
      this.certificateForm.value.expirationDate &&
      this.certificateForm.value.startDate >
      this.certificateForm.value.expirationDate) {
      this.dateValidator = true;
      this.cdr.detectChanges();
      return;
    }
    this.dateValidator = false;
    this.cdr.detectChanges();
    if(!this.certificateForm.valid) {
      return;
    }
    console.log(this.certificateForm.value.alias);
    console.log(this.aliases);
    if(this.aliases.includes(this.certificateForm.value.alias)) {
      this.errorMessage = 'This alias is taken. Please choose a new one.';
      return;
    }
    this.errorMessage = ""
    let certificate: CertificateNewDTO = this.certificateForm.value;
    // certificate.startDate = new Date(this.certificateForm.value.startDateString);
    // certificate.expirationDate = new Date(this.certificateForm.value.expirationDateString);
    certificate.extensions = { ca: this.certificateForm.value.ca, usage: []};
    certificate.issuerAlias = this.issuer;
    console.log(certificate)
    // USAGE??

    this.service.create(certificate).subscribe({
      next: () => {
        console.log('Created certificate with alias: ' + certificate.alias + " and issuer " + certificate.issuerAlias);
        this.visible = false;
        this.reload.emit(1);
      },
      error: (error) => {
        console.error(error.error.message);
      }
    });
  }
}
