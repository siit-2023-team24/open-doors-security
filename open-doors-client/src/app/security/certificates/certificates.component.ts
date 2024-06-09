import { Component, OnInit, ViewChild } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { CertificateDTO } from '../model/certificate';
import { MatDialog } from '@angular/material/dialog';
import { CreateCertificateDialogComponent } from '../create-certificate-dialog/create-certificate-dialog.component';
import { CertificateTemplateService } from '../certificate-template.service';
import { CertificateTemplateDTO } from '../model/certificiate-template';
import { CertificateNewTemplateDTO } from '../model/certificate-new-template';


@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css', '../../../styles.css']
})
export class CertificatesComponent implements OnInit{

  @ViewChild(CreateCertificateDialogComponent) otherChild: CreateCertificateDialogComponent;

  templates: CertificateTemplateDTO[] = [];
  certificates: CertificateDTO[] = [];
  aliases: string[] = [];
  root: CertificateDTO;

  constructor(public dialog:MatDialog,
              private certificateService: CertificateService,
              private templateService: CertificateTemplateService) {}

  ngOnInit(): void {
    this.aliases = [];
    this.certificates = [];
    this.templates = [];
    this.certificateService.getAll().subscribe({
      next: (dtos: CertificateDTO[]) => {
        for(let dto of dtos) {
          
          if(dto.alias != dto.issuerAlias) {
            this.certificates.push(dto)
          } else {
            this.root = dto;
          }
          this.aliases.push(dto.alias)
        }
      },
      error: () => {
        
      }
    })
    this.templateService.getAll().subscribe({
      next: (dtos: CertificateTemplateDTO[]) => {
        this.templates = dtos;
      },
      error: () => {
        
      }
    })
  }
  
  reloadParent(id: number) {
    this.ngOnInit();
  }

  createFromRoot() {
    this.openCreateForm(this.root.alias);
  }

  openCreateForm(alias: string) {
    this.otherChild.visible = true;
    this.otherChild.aliases = this.aliases;
    this.otherChild.templates = this.templates;
    this.otherChild.issuer = alias;
    this.otherChild.usage = [];
    this.otherChild.extendedUsages = [];
    this.otherChild.ngOnInit();
  }

  applyNone() {
    const template: CertificateTemplateDTO = {
      ca: false,
      extendedUsages: [],
      usage: [],
      name: "",
      id: -1
    }
    this.apply(template);
  }

  apply(template: CertificateTemplateDTO) {
    if(this.otherChild.extensionForm.value.ca != template.ca) {
      this.otherChild.toggle();
    }
    this.otherChild.usage = template.usage;
    this.otherChild.extendedUsages = template.extendedUsages;
    this.otherChild.ngOnInit;
  }

  createTemplate(template: CertificateNewTemplateDTO) {
    console.log(template);
    this.templateService.create(template).subscribe({
      next: (dto: CertificateTemplateDTO) => {
        console.log('Created template with id: ' + dto.id);
        this.ngOnInit();
      },
      error: (error) => {
        console.error(error.error.message);
      }
    });
  }

}
