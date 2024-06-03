import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccommodationSearchDTO } from './model/accommodation-search.model';
import { AccommodationWhole } from './model/accommodation-whole.model';
import { environment } from 'src/env/env';
import { HostListAccommodation } from './model/host-list-accommodation.model';
import { AccommodationWholeEdited } from './model/accommodation-whole-edited-model';
import { AccommodationWithTotalPriceDTO } from './model/accommodation-with-total-price.model';
import { SearchAndFilterDTO } from './model/search-and-filter.model';
import { SeasonalRatePricingDTO } from './model/seasonal-rates-pricing';
import { AccommodationSeasonalRateDTO } from './model/accommodation-seasonal-rate';
import { AccommodationFavoritesDTO } from './model/accommodation-favorites';
import { AccommodationNameDTO } from './model/accommodation-name';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {

  
  constructor(private http: HttpClient) { }


  add(dto: AccommodationWholeEdited): Observable<AccommodationWholeEdited>{
    console.log("in service:");
    console.log(dto);
    return this.http.post<AccommodationWholeEdited>(environment.apiHost + '/pending-accommodations', dto);
  }

  getAll() : Observable<AccommodationSearchDTO[]> {
    return this.http.get<AccommodationSearchDTO[]>(environment.apiHost + "/accommodations/all");
  }

  getAllWhenGuest(guestId: string) : Observable<AccommodationSearchDTO[]> {
    return this.http.get<AccommodationSearchDTO[]>(environment.apiHost + "/accommodations/all/" + guestId);
  }

  getAccommodation(id: number | null, accommodationId: number | null): Observable<AccommodationWithTotalPriceDTO> {
    if (!id) {
      console.log(id, accommodationId, "PRVI")
      return this.http.get<AccommodationWithTotalPriceDTO>(environment.apiHost + '/accommodations/' + accommodationId)
    }
    else {
      console.log(id, accommodationId, "DRUGI")
      return this.http.get<AccommodationWithTotalPriceDTO>(environment.apiHost + '/pending-accommodations/' + id)
    }
  }

  getAccommodationWhenGuest(accommodationId: number | null, guestId: string) : Observable<AccommodationWithTotalPriceDTO> {
    return this.http.get<AccommodationWithTotalPriceDTO>(environment.apiHost + "/accommodations/" + accommodationId + "/" + guestId);
  }

  searchAndFilterAccommodations(filterParams: SearchAndFilterDTO): Observable<AccommodationSearchDTO[]> {
    const searchEndpoint = environment.apiHost + "/accommodations/search";
    return this.http.post<AccommodationSearchDTO[]>(searchEndpoint, filterParams);
  }

  searchAndFilterAccommodationWhenGuest(guestId: string, filterParams: SearchAndFilterDTO): Observable<AccommodationSearchDTO[]> {
    const searchEndpoint = environment.apiHost + "/accommodations/search/" + guestId;
    return this.http.post<AccommodationSearchDTO[]>(searchEndpoint, filterParams);
  }

  addImages(id: number, formData: FormData): Observable<AccommodationWhole> {
    console.error(formData);
    return this.http.post<AccommodationWhole>(environment.apiHost + '/pending-accommodations/' + id + '/images', formData);
  }


  getEditable(id: number): Observable<AccommodationWhole> {
    return this.http.get<AccommodationWhole>(environment.apiHost + '/accommodations/editable/' + id);
  }

  getPending(id: number): Observable<AccommodationWhole> {
    return this.http.get<AccommodationWhole>(environment.apiHost + '/pending-accommodations/' + id)
  }

  getAllPending(): Observable<HostListAccommodation[]> {
    return this.http.get<HostListAccommodation[]>(environment.apiHost + '/pending-accommodations')
  }

  getForHost(hostId: string): Observable<HostListAccommodation[]> {
    return this.http.get<HostListAccommodation[]>(environment.apiHost + '/accommodations/host/' + hostId)
  }

  getPendingForHost(hostId: string): Observable<HostListAccommodation[]> {
    return this.http.get<HostListAccommodation[]>(environment.apiHost + '/pending-accommodations/host/' + hostId)
  }

  delete(id: number): Observable<Object> {
    return this.http.delete(environment.apiHost + '/accommodations/' + id)
  }

  deletePending(id: number): Observable<Object> {
    return this.http.delete(environment.apiHost + '/pending-accommodations/' + id)
  }

  denyPending(id: number): Observable<Object> {
    return this.http.delete(environment.apiHost + '/pending-accommodations/deny/' + id)
  }
  
  getAccommodationTypes(): Observable<string[]> {
    return this.http.get<string[]>(environment.apiHost + '/accommodations/accommodationTypes');
  }

  getAmenities(): Observable<string[]> {
    return this.http.get<string[]>(environment.apiHost + '/accommodations/amenities');
  }

  getSeasonalRatesForAccommodation(accommodationSeasonalRateDTO: AccommodationSeasonalRateDTO) : Observable<SeasonalRatePricingDTO[]> {
    return this.http.post<SeasonalRatePricingDTO[]>(environment.apiHost + '/accommodations/seasonalRate', accommodationSeasonalRateDTO);
  }
  
  approvePending(dto: HostListAccommodation): Observable<Object> {
    return this.http.put(environment.apiHost + '/pending-accommodations', dto);
  }

  addToFavorites(dto: AccommodationFavoritesDTO) {
    return this.http.post(environment.apiHost + "/accommodations/addToFavorites", dto);
  }

  removeFromFavorites(dto: AccommodationFavoritesDTO) {
    return this.http.post(environment.apiHost + '/accommodations/removeFromFavorites', dto);
  }

  getFavoriteAccommodations(guestId: string) : Observable<AccommodationSearchDTO[]> {
    return this.http.get<AccommodationSearchDTO[]>(environment.apiHost + "/accommodations/favorites/" + guestId);
  }

  getHostAccommodationNames(hostId: string): Observable<AccommodationNameDTO[]> {
	  return this.http.get<AccommodationNameDTO[]>(environment.apiHost + "/accommodations/names/" + hostId);
  }

}
