import { Component, OnInit } from '@angular/core';
import { ReservationRequestForGuestDTO } from '../model/reservation-request';
import { SearchAndFilterDTO } from '../model/search-and-filter';
import { ReservationRequestService } from '../reservation-request.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ReservationRequestForHost } from '../model/reservation-request-for-host';

@Component({
  selector: 'app-reservation-request-guest-page',
  templateUrl: './reservation-request-guest-page.component.html',
  styleUrls: ['./reservation-request-guest-page.component.css']
})
export class ReservationRequestGuestPageComponent implements OnInit{
  requestStatuses: string[] = [];
  requests: ReservationRequestForGuestDTO[] = [];
  searchParams: SearchAndFilterDTO = {accommodationName: null, startDate: null, endDate: null, status: null};

  role: string = "";
  noDataMessage = "";
  hostsRequests: ReservationRequestForHost[] = [];

  startDateFilter = (date: Date | null): boolean => {
    if (!this.searchParams.endDate) return true;
    return date ? date <= (this.searchParams.endDate) : true;
  };

  endDateFilter = (date: Date | null): boolean => {
    if (!this.searchParams.startDate) return true;
    return date ? date >= (this.searchParams.startDate) : true;
  };

  constructor(private requestService: ReservationRequestService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.loadRequestStatuses();
    this.fetchRequests()
  }

  private loadRequestStatuses(): void {
    this.requestService.getReservationStatuses().subscribe(
      (statuses: string[]) => {
        this.requestStatuses = statuses;
        this.requestStatuses.push('NO FILTER');
      }
    );
  }

  private fetchRequests(): void {
    if (this.role == 'ROLE_GUEST') {
      this.requestService.getAllForGuestId(this.authService.getId()).subscribe({
        next: (requests: ReservationRequestForGuestDTO[]) => {
          this.requests = requests;
          requests.forEach(request => {
            console.log(request);
          })
        },
        error: (error) => {
          console.error("Error fetching requests: ", error);
        }
      });
    } else {
      this.requestService.getAllForHost(this.authService.getId()).subscribe({
        next: (data: ReservationRequestForHost[]) => {
          this.hostsRequests = data;
          if (data.length == 0)
            this.noDataMessage = "You do not have any reservation requests.\n";
        },
        error: (error) => console.error("Error fetching requests: ", error)
      })
    }
  }

  searchAndFilterRequests(): void {
    console.log(this.searchParams);

    if (!this.searchParams.accommodationName || this.searchParams.accommodationName.trim() === '') {
      this.searchParams.accommodationName = null;
    }
    if (this.searchParams.status?.toString() == 'NO FILTER')
      this.searchParams.status = null;

    if (this.role == "ROLE_GUEST") {
      this.requestService.searchAndFilter(this.authService.getId(), this.searchParams)
      .subscribe(
        (data) => {
          console.log("Backend Response: ", data);
          this.requests = data;
        },
        (error) => {
          console.error("Error: ", error);
        }
      )
    } else {
      this.requestService.searchAndFilterForHost(this.authService.getId(), this.searchParams).subscribe ({
        next: (data: ReservationRequestForHost[]) => {
          this.hostsRequests = data;
          if (data.length == 0)
            this.noDataMessage = "You do not have any reservation requests.\n";
          else
            this.noDataMessage = "";
        },
        error: (error) => console.error("Error searching requests: ", error)
      })
    }
    
  }

  reloadParent(id: number): void {
    this.ngOnInit();
  }

}
