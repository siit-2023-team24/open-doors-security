import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

  usage: number[] = [];
  usageText: string[] =
  ["Encipher only", "CRL Sign", "Key certificate signature", "Key agreement", "Data encipherment",
  "Key encipherment", "Non-repudiation", "Digital signature", "Decipher only"];
  extendedUsageText: string[] = ["None",
  "Any extended key usage", "Server authentication", "Client authentication", "Code signing", "Email protection",
  "IPSEC end system", "IPSEC tunnel", "IPSEC user", "Time stamping", "OCSP signing",
  "DVCS", "SBGP Certificate AA server authentication", "SCVP responder", "EAP over PPP", "EAP over LAN",
  "SCVP server", "SCVP client", "IPSEC IKE", "Capwap AC", "Capwap WTP"]
  extendedUsage: number = 0;

  certificateForm: FormGroup;
  extensionForm: FormGroup;
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

    this.extensionForm = this.formBuilder.group({
      ca: [false],
    });
  }
  get checkboxes(): FormArray {
    return this.extensionForm.get('checkboxes') as FormArray;
  }

  onCheckboxChange(value: number, isChecked: boolean) {
    if(value == 8) value = 15;
    if (isChecked) {
      this.usage.push(value);
    } else {
      const index = this.usage.indexOf(value);
      if (index >= 0) {
        this.usage.splice(index, 1);
      }
    }
    console.log(this.usage);
  }

  onCreateClick(): void {
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
    certificate.extensions = {
      ca: this.extensionForm.value.ca,
      usage: this.usage,
      extendedUsage: this.extendedUsage - 1
    };

    certificate.issuerAlias = this.issuer;
    console.log(certificate.extensions)
    

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
