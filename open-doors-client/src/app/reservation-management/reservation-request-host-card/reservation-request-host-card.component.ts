import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationRequestService } from '../reservation-request.service';
import { ReservationRequestForHost } from '../model/reservation-request-for-host';
import { ReservationRequestStatus } from '../model/reservation-request-status';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { SocketService } from 'src/app/shared/socket.service';
import { Message } from 'src/app/shared/model/notification';
import { NotificationType } from 'src/app/shared/model/notification.type';

@Component({
  selector: 'app-reservation-request-host-card',
  templateUrl: './reservation-request-host-card.component.html',
  styleUrls: ['./reservation-request-host-card.component.css']
})
export class ReservationRequestHostCardComponent {

  constructor(private snackBar: MatSnackBar,
     private service: ReservationRequestService,
     private dialog: MatDialog,
     private socketService: SocketService) {}

  @Input()
  request: ReservationRequestForHost;

  @Output()
  reload: EventEmitter<number> = new EventEmitter();


  confirm(): void {
    const message: string = "Are you sure you wish to confirm this reservation request?";

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { question: message }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {  
        if (!answer) return;

        this.service.confirm(this.request.id).subscribe({
          next: () => {
            this.reload.emit(this.request.id);
            console.log('Confirmed reservation request: ' + this.request.id);
            this.showSnackBar("Confirmed reservation request");

            let message : Message = {
              timestamp: new Date,
              username: this.request.guestUsername,
              message: "Your reservation request #" + this.request.id + " has been confirmed.",
              type: NotificationType.RESERVATION_REQUEST
            }
            this.socketService.sendMessageUsingSocket(message);

          },
          error: (error) => {
            console.error('Error confirming reservation request ' + this.request.id)
            this.showSnackBar(error.error.message);
          }
        });
      }
    });
  }

  deny(): void {
    const message: string = "Are you sure you wish to deny this reservation request?";
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { question: message }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (!answer) return;

        this.service.deny(this.request.id).subscribe({
          next: () => {
            this.reload.emit(this.request.id);
            console.log('Denied reservation request: ' + this.request.id);
            this.showSnackBar("Denied reservation request");

            let message : Message = {
              timestamp: new Date,
              username: this.request.guestUsername,
              message: "Your reservation request #" + this.request.id + " has been denied.",
              type: NotificationType.RESERVATION_REQUEST
            }
            this.socketService.sendMessageUsingSocket(message);

          },
          error: (error) => {
            console.error('Error denying reservation request ' + this.request.id)
            this.showSnackBar(error.error.message);
          }
        });
      }
    });
  }

  isRequestPending(): boolean {
    if (this.request.status !== ReservationRequestStatus.PENDING)
      return false;

    const today: Date = new Date();
    const t = today < new Date(this.request.startDate);
    return t;
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
  

}
