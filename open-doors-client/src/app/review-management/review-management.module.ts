import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { MaterialModule } from '../infrastucture/material/material.module';
import { ReviewCardComponent } from './review-card/review-card.component';
import { WriteReviewCardComponent } from './write-review-card/write-review-card.component';
import { HostReviewsComponent } from './host-reviews/host-reviews.component';
import { FormsModule } from '@angular/forms';
import { ReviewsAdminPageComponent } from './reviews-admin-page/reviews-admin-page.component';
import { PendingReviewCardComponent } from './pending-review-card/pending-review-card.component';
import { ReportedReviewCardComponent } from './reported-review-card/reported-review-card.component';

@NgModule({
  declarations: [
    ReviewCardComponent,
    WriteReviewCardComponent,
    HostReviewsComponent,
    ReviewsAdminPageComponent,
    PendingReviewCardComponent,
    ReportedReviewCardComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    ReviewCardComponent,
    WriteReviewCardComponent,
    HostReviewsComponent
  ]
})
export class ReviewManagementModule { }
