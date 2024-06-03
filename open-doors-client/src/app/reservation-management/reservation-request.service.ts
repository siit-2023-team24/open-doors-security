import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchAndFilterDTO } from './model/search-and-filter';
import { Observable } from 'rxjs';
import { ReservationRequestForGuestDTO } from './model/reservation-request';
import { environment } from 'src/env/env';
import { ReservationRequestForHost } from './model/reservation-request-for-host';

@Injectable({
  providedIn: 'root'
})
export class ReservationRequestService {

  constructor(private http: HttpClient) { }

  getAllForGuestId(guestId: string): Observable<ReservationRequestForGuestDTO[]> {
    const endpoint = environment.apiHost + "/reservations/all/guest/" + guestId;
    return this.http.get<ReservationRequestForGuestDTO[]>(endpoint);
  }

  getAllForHost(id: string): Observable<ReservationRequestForHost[]> {
    return this.http.get<ReservationRequestForHost[]>(environment.apiHost + "/reservations/host/" + id);
  }

  searchAndFilter(guestId:string, filterParams: SearchAndFilterDTO): Observable<ReservationRequestForGuestDTO[]> {
    const searchEndpoint = environment.apiHost + "/reservations/search/" + guestId;
    return this.http.post<ReservationRequestForGuestDTO[]>(searchEndpoint, filterParams);
  }

  searchAndFilterForHost(hostId: string, filterParams: SearchAndFilterDTO): Observable<ReservationRequestForHost[]> {
    return this.http.post<ReservationRequestForHost[]>(environment.apiHost + "/reservations/host-search/" + hostId, filterParams);
  }

  getReservationStatuses(): Observable<string[]> {
    return this.http.get<string[]>(environment.apiHost + "/reservations/requestStatuses")
  }

  cancelRequest(requestId: number): Observable<Object> {
    const endpoint = environment.apiHost + "/reservations/cancel/" + requestId;
    return this.http.get(endpoint);
  }

  deleteRequest(requestId: number): Observable<Object> {
    const endpoint = environment.apiHost + "/reservations/" + requestId;
    return this.http.delete(endpoint);
  }

  confirm(id: number): Observable<Object> {
    return this.http.get(environment.apiHost + "/reservations/confirm/" + id);
  }

  deny(id: number): Observable<Object> {
    return this.http.get(environment.apiHost + "/reservations/deny/" + id);
  }
}
