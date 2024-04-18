import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { UserReportService } from '../user-report.service';
import { NewUserReportDTO } from '../model/new-user-report';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { UserReportDTO } from '../model/user-report';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-write-report-card',
  templateUrl: './write-report-card.component.html',
  styleUrls: ['./write-report-card.component.css']
})
export class WriteReportCardComponent {
  @Input() username: string

  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  constructor (private authService: AuthService,
              private userReportService: UserReportService,
              private dialog: MatDialog,
              private router: Router,
              private snackBar: MatSnackBar) {}

  reason: string = "";
  noReason: boolean = false;
  

  reportUser(): void {
    if (this.reason == "" || this.reason == null) {
      this.noReason = true;
      return;
    }
    this.noReason = false;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      question: "Are you sure you report the user " + this.username + " ?"
    }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) this.confirmChoice();
      }
    })
  }
  

  confirmChoice(): void {
    const dto : NewUserReportDTO = {
      recipientUsername: this.username,
      complainantUsername: this.authService.getUsername(),
      isComplainantGuest: this.authService.getRole() == "ROLE_GUEST",
      reason: this.reason
    }
    this.userReportService.createUserReview(dto).subscribe({
      next: (response: UserReportDTO) => {
        console.log('Created report:');
        console.log(response);
        this.reload.emit(1);
      },
      error: (error) => {
        console.error(error.error.message);
        this.showSnackBar(error.error.message)
      }
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
  
}
