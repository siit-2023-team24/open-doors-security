import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccommodationSearchDTO } from '../model/accommodation-search.model';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/image-management/image.service';
import { AccommodationService } from '../accommodation.service';
import { AccommodationFavoritesDTO } from '../model/accommodation-favorites';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-accommodation-card',
  templateUrl: './accommodation-card.component.html',
  styleUrls: ['./accommodation-card.component.css']
})
export class AccommodationCardComponent implements OnInit{
  isGuest: boolean = false;
  constructor(
    private snackBar: MatSnackBar,
    private router: Router, 
    private imageService: ImageService,
    private accommodationService: AccommodationService,
    private authService: AuthService) {}
  
  ngOnInit(): void {
    this.isGuest = (this.authService.getRole() || "") == "ROLE_GUEST";
  }

  @Input()
  accommodation: AccommodationSearchDTO;

  @Output()
  clicked: EventEmitter<AccommodationSearchDTO> = new EventEmitter<AccommodationSearchDTO>();

  onAccommodationClicked(): void {
    this.router.navigate(["/accommodation/null", this.accommodation.id]);
  }

  getImagePath(): string {
    return this.imageService.getPath(this.accommodation.image, false);
  }

  toggleFavorite() {
    const guestId = this.authService.getId();
    const accommodationId = this.accommodation.id;
    const favoritesDTO: AccommodationFavoritesDTO = { guestId, accommodationId };

    if(!this.accommodation.isFavoriteForGuest) {  
      this.accommodationService.addToFavorites(favoritesDTO).subscribe(
        () => {
          this.showSnackBar('Added to favorites!');
        },
        (error) => {
          console.error("Error adding to favorites: ", error);
        }
      );
    }
    else {
      this.accommodationService.removeFromFavorites(favoritesDTO).subscribe(
        () => {
          this.showSnackBar('Removed from favorites!');
        },
        (error) => {
          console.error("Error removing from favorites: ", error);
        }
      );
    }
    this.accommodation.isFavoriteForGuest = !this.accommodation.isFavoriteForGuest;
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
