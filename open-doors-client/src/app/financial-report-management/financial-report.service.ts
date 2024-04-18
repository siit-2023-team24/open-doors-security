import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DateRangeReport } from './model/date-range-report';
import { environment } from 'src/env/env';
import { DateRangeReportParams } from './model/date-range-report-params';
import { AccommodationIdReport } from './model/accommodation-id-report';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportService {

  constructor(private http: HttpClient) { }

  getDateRangeReport(params: DateRangeReportParams): Observable<DateRangeReport[]> {
    return this.http.post<DateRangeReport[]>(environment.apiHost + "/financialReport/dateRangeReport", params);
  }

  getAccommodationIdReport(accommodationId: number): Observable<AccommodationIdReport[]> {
    return this.http.get<AccommodationIdReport[]>(environment.apiHost + "/financialReport/accommodationIdReport/" + accommodationId);
  }

  exportDateRangeReport(params: DateRangeReportParams) {
    return this.http.post(environment.apiHost + "/financialReport/dateRangeReport/export", params);
  }

  exportAccommodationIdReport(accommodationId: number) {
    return this.http.post(environment.apiHost + "/financialReport/accommodationIdReport/export", accommodationId);
  }
}
