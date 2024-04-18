import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewDetailsDTO } from '../model/review-details';
import { ImageService } from 'src/app/image-management/image.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReviewService } from '../review.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent {
  @Input() review: ReviewDetailsDTO;
  @Input() isHost: boolean;
  @Input() canReport: boolean;

  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  imagePath: string = "";
  guest: string = "";

  constructor(private imageService: ImageService,
              private authService: AuthService,
              private dialog: MatDialog,
              private reviewService: ReviewService,
              private router: Router) {}
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.guest = this.authService.getUsername();
    }
    this.imagePath = this.imageService.getPath(this.review.imageId, true);
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      question: "Are you sure you wish to delete your review?"
    }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) this.onDelete();
      }
    })
  }

  onDelete(): void {
    if(this.isHost) {
      this.reviewService.deleteHostReview(this.review.id).subscribe({
        next: () => {
          console.log('Deleted host review with id: ' + this.review.id);
          this.reload.emit(this.review.id);
        },
        error: (error) => {
          console.error(error.error.message);
        }
      });
    }
    else {
      this.reviewService.deleteAccommodationReview(this.review.id).subscribe({
        next: () => {
          console.log('Deleted accommodation review with id: ' + this.review.id);
          this.reload.emit(1);
        },
        error: (error) => {
          console.error(error.error.message);
        }
      });
    }
  }

  changeReportedStatus(): void {
    this.reviewService.changeReportedStatus(this.review.id).subscribe({
      next: () => {
        this.reload.emit(this.review.id);
      },
      error: (error) => {
        
      }
    });
  }
}
