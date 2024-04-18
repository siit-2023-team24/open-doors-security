import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MakeReservationRequestDTO } from './model/reservationRequest';
import { Observable } from 'rxjs';
import { environment } from 'src/env/env';

@Injectable({
  providedIn: 'root'
})
export class ReservationRequestService {

  constructor(private httpClient: HttpClient) { }

  makeReservation(reservationRequest: MakeReservationRequestDTO): Observable<MakeReservationRequestDTO>{
    return this.httpClient.post<MakeReservationRequestDTO>(environment.apiHost + '/reservations/createRequest', reservationRequest);
  }
}
