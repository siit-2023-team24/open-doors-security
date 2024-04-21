import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CertificateRequestDTO } from './model/certificate-request';
import { environment } from 'src/env/env';
import { CertificateRequestApprovedDTO } from './model/certificate-request-approved';

@Injectable({
  providedIn: 'root'
})
export class CertificateRequestService {

  constructor(private httpClient: HttpClient) { }
  
  getAll(): Observable<CertificateRequestDTO[]> {
    return this.httpClient.get<CertificateRequestDTO[]>(environment.pkiHost + '/certificate-requests')
  }
  
  approve(certificateDTO: CertificateRequestApprovedDTO) {
    return this.httpClient.post<CertificateRequestDTO>(environment.pkiHost + '/certificate-requests/approve', certificateDTO)
  }

  deny(userId: number): Observable<Object> {
    return this.httpClient.delete(environment.pkiHost + '/certificate-requests/deny/' + userId)
  }
}
