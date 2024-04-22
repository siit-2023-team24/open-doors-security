import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CertificateTemplateDTO } from './model/certificiate-template';
import { environment } from 'src/env/env';
import { Observable } from 'rxjs';
import { CertificateNewTemplateDTO } from './model/certificate-new-template';

@Injectable({
  providedIn: 'root'
})
export class CertificateTemplateService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<CertificateTemplateDTO[]> {
    return this.httpClient.get<CertificateTemplateDTO[]>(environment.pkiHost + '/certificate-templates')
  }

  create(templateDTO: CertificateNewTemplateDTO): Observable<CertificateTemplateDTO> {
    return this.httpClient.post<CertificateTemplateDTO>(environment.pkiHost + '/certificate-templates', templateDTO)
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(environment.pkiHost + '/certificate-templates/' + id)
  }
}
