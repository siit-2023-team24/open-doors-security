import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { MaterialModule } from '../infrastucture/material/material.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AccommodationCardComponent } from './accommodation-card/accommodation-card.component';
import { MapViewComponent } from './map-view/map-view.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AccommodationPageComponent } from './accommodation-page/accommodation-page.component';
import { MyAccommodationsComponent } from './my-accommodations/my-accommodations.component';
import { CreateAccommodationComponent } from './create-accommodation/create-accommodation.component';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';

import { ReviewManagementModule } from '../review-management/review-management.module';
import { MyAccommodationCardComponent } from './my-accommodation-card/my-accommodation-card.component';
import { PendingAccommodationsComponent } from './pending-accommodations/pending-accommodations.component';
import { PendingAccommodationCardComponent } from './pending-accommodation-card/pending-accommodation-card.component';
import { SharedModule } from '../shared/shared.module';
import { FavoritesPageComponent } from './favorites-page/favorites-page.component';

@NgModule({
  declarations: [
    AccommodationCardComponent,
    MapViewComponent,
    HomePageComponent,
    AccommodationPageComponent,
    MyAccommodationsComponent,
    CreateAccommodationComponent,
    FilterPopupComponent,
    MyAccommodationCardComponent,
    PendingAccommodationsComponent,
    PendingAccommodationCardComponent,
    FavoritesPageComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReviewManagementModule,
    SharedModule
  ],
  exports: [
    AccommodationCardComponent,
    MapViewComponent,
    HomePageComponent,
    AccommodationPageComponent,
    MyAccommodationsComponent,
    FilterPopupComponent,
    PendingAccommodationsComponent
  ]
})
export class AccommodationManagementModule { }