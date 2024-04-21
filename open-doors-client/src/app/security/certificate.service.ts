import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CertificateDTO } from './model/certificate';
import { environment } from 'src/env/env';
import { CertificateNewDTO } from './model/certificate-new';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<CertificateDTO[]> {
    return this.httpClient.get<CertificateDTO[]>(environment.pkiHost + '/certificates')
  }

  create(certificateDTO: CertificateNewDTO) {
    return this.httpClient.post<CertificateDTO>(environment.pkiHost + '/certificates', certificateDTO)
  }

  delete(alias: string): Observable<Object> {
    return this.httpClient.delete(environment.pkiHost + '/certificates/' + alias)
  }

}
