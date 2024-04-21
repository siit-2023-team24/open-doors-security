import { Component, OnInit, ViewChild } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { CertificateDTO } from '../model/certificate';
import { MatDialog } from '@angular/material/dialog';
import { CreateCertificateDialogComponent } from '../create-certificate-dialog/create-certificate-dialog.component';


@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit{

  @ViewChild(CreateCertificateDialogComponent) otherChild: CreateCertificateDialogComponent;

  certificates: CertificateDTO[] = [];
  aliases: string[] = [];
  root: CertificateDTO;

  constructor(public dialog:MatDialog,
              private certificateService: CertificateService) {}

  ngOnInit(): void {
    this.aliases = [];
    this.certificates = [];
    this.certificateService.getAll().subscribe({
      next: (dtos: CertificateDTO[]) => {
        for(let dto of dtos) {
          if(dto.alias != dto.issuerAlias) {
            this.certificates.push(dto)
          } else {
            this.root = dto
          }
          this.aliases.push(dto.alias)
        }
        this.otherChild.aliases = this.aliases;
      },
      error: () => {
        
      }
    })
  }
  
  reloadParent(id: number) {
    this.ngOnInit();
  }

  createFromRoot() {
    this.openCreateForm(this.root.alias)
  }

  openCreateForm(alias: string) {
    this.otherChild.issuer = alias;
    this.otherChild.visible = true;
    this.otherChild.usage=[];
    this.otherChild.extendedUsage=0;
    this.otherChild.ngOnInit();
  }

}
