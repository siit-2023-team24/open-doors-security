import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SearchAndFilterDTO } from '../model/search-and-filter.model';
import { AccommodationService } from '../accommodation.service';

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.css']
})
export class FilterPopupComponent implements OnInit{
  propertyTypes: string[] = [];
  amenities: string[] = [];

  selectedPropertyTypes: { [key: string]: boolean } = {};
  minPrice: number;
  maxPrice: number;
  selectedAmenities: { [key: string]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<FilterPopupComponent>,
    private accommodationService: AccommodationService
  ) {}

  ngOnInit(): void {
    this.loadPropertyTypes();
    this.loadAmenities();
  }

  loadPropertyTypes(): void {
    this.accommodationService.getAccommodationTypes().subscribe(
      (types: string[]) => {
        this.propertyTypes = types;
        this.initializeSelectedPropertyTypes();
      },
      error => {
        console.error("Error loading property types: ", error);
      }
    );
  }

  loadAmenities(): void {
    this.accommodationService.getAmenities().subscribe(
      (amenities: string[]) => {
        this.amenities = amenities;
        this.initializeSelectedAmenities();
      },
      error => {
        console.error("Error loading amenities: ", error);
      }
    );
  }

  initializeSelectedPropertyTypes(): void {
    this.propertyTypes.forEach(type => {
      this.selectedPropertyTypes[type] = false;
    });
  }

  initializeSelectedAmenities(): void {
    this.amenities.forEach(amenity => {
      this.selectedAmenities[amenity] = false;
    });
  }

  applyFilters(): void {
    const selectedTypes = Object.keys(this.selectedPropertyTypes).filter(type => this.selectedPropertyTypes[type]);
    const selectedAmenities = Object.keys(this.selectedAmenities).filter(amenity => this.selectedAmenities[amenity]);

    const filterParams: SearchAndFilterDTO = {
      location: null,
      guestNumber: null,
      startDate: null,
      endDate: null,
      startPrice: this.minPrice,
      endPrice: this.maxPrice,
      types: selectedTypes,
      amenities: selectedAmenities
    };

    this.dialogRef.close(filterParams);
  }
}
