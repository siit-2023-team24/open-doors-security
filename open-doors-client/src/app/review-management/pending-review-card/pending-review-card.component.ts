import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PendingReview } from '../model/pending-review';
import { ReviewService } from '../review.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from 'src/app/shared/socket.service';
import { Message } from 'src/app/shared/model/notification';
import { NotificationType } from 'src/app/shared/model/notification.type';

@Component({
  selector: 'app-pending-review-card',
  templateUrl: './pending-review-card.component.html',
  styleUrls: ['./pending-review-card.component.css']
})
export class PendingReviewCardComponent {

  @Input()
  review: PendingReview;
  
  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  constructor(private service: ReviewService,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private socketService: SocketService) {}

  dialogApprove(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { question: "Are you sure you wish to approve this review?" }
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) this.approve();

        let message : Message = {
          timestamp: new Date,
          username: this.review.hostUsername,
          message: "Your accommodation " + this.review.accommodationName + " was just reviewed.",
          type: NotificationType.ACCOMMODATION_REVIEW
        }
        this.socketService.sendMessageUsingSocket(message);
      }
    })
  }

  private approve(): void {
    this.service.approve(this.review.id).subscribe({
      next: () => {
        this.showSnackBar("Approved review");
        this.reload.emit(this.review.id);
      },
      error: (error) => {
        console.error("Error approving review: " + this.review.id);
        console.error(error.error.message);
        this.showSnackBar(error.error.message)
      }
    })
  }

  dialogDeny(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { question: "Are you sure you wish to deny this review?" }
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) this.deny();
      }
    })
  }

  private deny(): void {
    this.service.deny(this.review.id).subscribe({
      next: () => {
        this.showSnackBar("Denied review");
        console.log("Denied review " + this.review.id)
        this.reload.emit(this.review.id);
      },
      error: (error) => {
        console.error("Error denying review: " + this.review.id);
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
