import { Component } from '@angular/core';
import { PendingReview } from '../model/pending-review';
import { ReviewService } from '../review.service';
import { ReportedReview } from '../model/reported-review';

@Component({
  selector: 'app-reviews-admin-page',
  templateUrl: './reviews-admin-page.component.html',
  styleUrls: ['./reviews-admin-page.component.css']
})
export class ReviewsAdminPageComponent {

  pending: PendingReview[] = [];
  noPendingMessage: string = "";

  reported: ReportedReview[] = [];
  noReportedMessage = "";

  constructor(private service: ReviewService) {}

  ngOnInit(): void {
    this.service.getPendingReviews().subscribe({
      next: (data: PendingReview[]) => {
        this.pending = data;
        if (data.length == 0)
          this.noPendingMessage = "There are no pending reviews right now.";
      },
      error: () => console.error("Error getting pending reviews ")
    });

    this.service.getReportedReviews().subscribe({
      next: (data: ReportedReview[]) => {
        this.reported = data;
        if (data.length == 0)
          this.noReportedMessage = "There are no reported reviews right now.";
      }, 
      error: () => console.error("Error getting reported reviews")
    });
  }


  reloadParent(id: number): void {
    this.ngOnInit();
  }
}
