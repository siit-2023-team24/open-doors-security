import { Component, OnInit } from '@angular/core';
import { AccommodationSearchDTO } from '../model/accommodation-search.model';
import { AccommodationService } from '../accommodation.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent implements OnInit{
  accommodations: AccommodationSearchDTO[] = [];

  constructor(
    private accommodationService: AccommodationService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchAccommodations();
  }

  private fetchAccommodations(): void {
    this.accommodationService.getFavoriteAccommodations(this.authService.getId()).subscribe(
      (accommodations: AccommodationSearchDTO[]) => {
        this.accommodations = accommodations;
        accommodations.forEach(accommodation => {
          console.log(accommodation);
        });
      },
      error => {
        console.error("Error fetching favorite accommodations: ", error);
      }
      
    )
  }
}
