import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CertificateDTO } from './model/certificate';
import { environment } from 'src/env/env';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private httpClient: HttpClient) { }

  getCertificates(): Observable<CertificateDTO[]> {
    return this.httpClient.get<CertificateDTO[]>(environment.pkiHost + '/certificates')
  }

  createCertificate(certificateDTO: CertificateDTO) {
    return this.httpClient.post<CertificateDTO>(environment.pkiHost + '/certificates', certificateDTO)
  }

  deleteCertificate(serialNumber: string): Observable<Object> {
    return this.httpClient.delete(environment.pkiHost + '/certificates/' + serialNumber)
  }

}
