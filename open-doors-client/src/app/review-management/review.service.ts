import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewDetailsDTO } from './model/review-details';
import { environment } from 'src/env/env';
import { HostPublicDataDTO } from './model/host-public-data';
import { NewReviewDTO } from './model/new-review';
import { HostReviewWholeDTO } from './model/host-review-whole';
import { AccommodationReviewsDTO } from './model/accommodation-reviews';
import { AccommodationReviewWholeDTO } from './model/accommodation-review-whole';
import { PendingReview } from './model/pending-review';
import { ReportedReview } from './model/reported-review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpClient: HttpClient) { }

  getReviewsForAccommodation(accommodationId: number, guestId: number) : Observable<AccommodationReviewsDTO> {
    let params = new HttpParams().set('guestId', guestId.toString());
    return this.httpClient.get<AccommodationReviewsDTO>(environment.apiHost + '/accommodation-reviews/' + accommodationId, { params });
  }

  getReviewsForHost(hostId: number, guestId: number) : Observable<HostPublicDataDTO> {
    let params = new HttpParams().set('guestId', guestId.toString());
    return this.httpClient.get<HostPublicDataDTO>(environment.apiHost + '/host-reviews/' + hostId, { params })
  }

  createHostReview(dto: NewReviewDTO) : Observable<HostReviewWholeDTO> {
    return this.httpClient.post<HostReviewWholeDTO>(environment.apiHost + '/host-reviews', dto);
  }

  createAccommodationReview(dto: NewReviewDTO) : Observable<AccommodationReviewWholeDTO> {
    return this.httpClient.post<AccommodationReviewWholeDTO>(environment.apiHost + '/accommodation-reviews', dto);
  }

  deleteHostReview(id: number) : Observable<Object> {
    return this.httpClient.delete(environment.apiHost + "/host-reviews/" + id);
  }

  deleteAccommodationReview(id: number) : Observable<Object> {
    return this.httpClient.delete(environment.apiHost + "/accommodation-reviews/" + id);
  }

  changeReportedStatus(id: number) : Observable<Object> {
    return this.httpClient.post(environment.apiHost + "/host-reviews/" + id + "/status", {});
  }

  getPendingReviews(): Observable<PendingReview[]> {
    return this.httpClient.get<PendingReview[]>(environment.apiHost + '/accommodation-reviews/pending');
  }

  getReportedReviews(): Observable<ReportedReview[]> {
    return this.httpClient.get<ReportedReview[]>(environment.apiHost + '/host-reviews/reported');
  }

  approve(id: number): Observable<Object> {
    return this.httpClient.get(environment.apiHost + '/accommodation-reviews/approve/' + id);
  }

  deny(id: number): Observable<Object> {
    return this.httpClient.get(environment.apiHost + '/accommodation-reviews/deny/' + id);
  }
}
