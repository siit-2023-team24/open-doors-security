import { Component, OnInit } from '@angular/core';
import { AccommodationService } from '../accommodation.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { AccommodationSearchDTO } from '../model/accommodation-search.model';
import { SearchAndFilterDTO } from '../model/search-and-filter.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css', '../../../styles.css']
})
export class HomePageComponent implements OnInit {
  isGuest: boolean = false;
  accommodations: AccommodationSearchDTO[] = [];
  filterParams: SearchAndFilterDTO = { location: null, guestNumber: null, startDate: null, endDate: null, startPrice: null, endPrice: null, types: [], amenities: [] };
  searchBarValues: SearchAndFilterDTO = { location: null, guestNumber: null, startDate: null, endDate: null, startPrice: null, endPrice: null, types: [], amenities: [] };
  // Datepicker filters
  startDateFilter = (date: Date | null): boolean => {
    const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    return date ? date >= yesterday && (!this.searchBarValues.endDate || date <= this.searchBarValues.endDate) : true;
  };  

  endDateFilter = (date: Date | null): boolean => {
    return date ? date >= new Date() && (!this.searchBarValues.startDate || date >= this.searchBarValues.startDate) : true;
  };
  
  constructor(public dialog: MatDialog, 
              private accommodationService: AccommodationService,
              private authService: AuthService) {}

  ngOnInit(): void {
      this.isGuest = (this.authService.getRole() || "") == "ROLE_GUEST";
      this.fetchAccommodations();
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterPopupComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filterParams = result;
        this.searchAndFilterAccommodations();
      }
    });
  }

  private fetchAccommodations(): void {
    if(this.isGuest) {
      this.accommodationService.getAllWhenGuest(this.authService.getId()).subscribe(
        (accommodations: AccommodationSearchDTO[]) => {
          this.accommodations = accommodations;
          accommodations.forEach(accommodation => {
            console.log(accommodation);
          });
        },
        error => {
          console.error("Error fetching accommodations: ", error);
        }
        
      );
    } else {
      this.accommodationService.getAll().subscribe(
        (accommodations: AccommodationSearchDTO[]) => {
          this.accommodations = accommodations;
          accommodations.forEach(accommodation => {
            console.log(accommodation);
          });
        },
        error => {
          console.error("Error fetching accommodations: ", error);
        }
        
      );
    }
  }

  searchAndFilterAccommodations(): void {
    const searchBarValues = this.searchBarValues;

    const combinedParams: SearchAndFilterDTO = {
      location: searchBarValues.location,
      guestNumber: searchBarValues.guestNumber,
      startDate: searchBarValues.startDate,
      endDate: searchBarValues.endDate,
      startPrice: this.filterParams.startPrice,
      endPrice: this.filterParams.endPrice,
      types: this.filterParams.types,
      amenities: this.filterParams.amenities,
    };

    console.log(combinedParams);

    if(this.isGuest) {
      this.accommodationService.searchAndFilterAccommodationWhenGuest(this.authService.getId(), combinedParams)
      .subscribe(
        (data) => {
          console.log("Backend Response:", data);
          this.accommodations = data;
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    }
    else {
      this.accommodationService.searchAndFilterAccommodations(combinedParams)
      .subscribe(
        (data) => {
          console.log("Backend Response:", data);
          this.accommodations = data;
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    }
  }

}
