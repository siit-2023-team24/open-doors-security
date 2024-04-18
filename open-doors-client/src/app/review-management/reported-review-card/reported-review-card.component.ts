import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReportedReview } from '../model/reported-review';
import { ReviewService } from '../review.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-reported-review-card',
  templateUrl: './reported-review-card.component.html',
  styleUrls: ['./reported-review-card.component.css']
})
export class ReportedReviewCardComponent {
  
  @Input()
  review: ReportedReview;
  
  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  constructor(private service: ReviewService,
    private dialog: MatDialog, private snackBar: MatSnackBar) {}

    dialogDismiss(): void {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = { question: "Are you sure you wish to dismiss this report?" }
      const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe({
        next: (answer: boolean) => {
          if (answer) this.dismiss();
        }
      })
    }
  
    private dismiss(): void {
      this.service.changeReportedStatus(this.review.id).subscribe({
        next: () => {
          this.showSnackBar("Dismissed report");
          console.log("Dismissed report " + this.review.id)
          this.reload.emit(this.review.id);
        },
        error: (error) => {
          console.error("Error dismissing report: " + this.review.id);
          console.error(error.error.message);
          this.showSnackBar(error.error.message)
        }
      })
    }


    dialogDelete(): void {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = { question: "Are you sure you wish to delete this review?" }
      const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe({
        next: (answer: boolean) => {
          if (answer) this.delete();
        }
      })
    }
  
    private delete(): void {
      this.service.deleteHostReview(this.review.id).subscribe({
        next: () => {
          this.showSnackBar("Deleted review");
          console.log("Deleted review " + this.review.id)
          this.reload.emit(this.review.id);
        },
        error: (error) => {
          console.error("Error deleting review: " + this.review.id);
          console.error(error.error.message);
          this.showSnackBar(error.error.message)
        }
      })
    }

    private showSnackBar(message: string): void {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
      });
    }

}
