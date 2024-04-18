import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserReportDTO } from '../model/user-report';
import { UserReportService } from '../user-report.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-user-report-card',
  templateUrl: './user-report-card.component.html',
  styleUrls: ['./user-report-card.component.css']
})
export class UserReportCardComponent {
  
  @Input()
  report: UserReportDTO;
  
  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  constructor(private service: UserReportService,
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

  dismiss() {
    this.service.dismiss(this.report.id).subscribe({
      next: () => {
        this.showSnackBar("Dismissed report");
        console.log("Dismissed report " + this.report.id)
        this.reload.emit(this.report.id);
      },
      error: (error) => {
        console.error("Error dismissing report: " + this.report.id);
        console.error(error.error.message);
        this.showSnackBar(error.error.message)
      }
    })
  }


  dialogBlock(): void {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = { question: "Are you sure you wish to block this user?" }
      const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe({
        next: (answer: boolean) => {
          if (answer) this.resolve();
        }
      })
  }

  resolve() {
      this.service.resolve(this.report.id).subscribe({
        next: () => {
          this.showSnackBar("Blocked user");
          console.log("Blocked user " + this.report.id)
          this.reload.emit(this.report.id);
        },
        error: (error) => {
          console.error("Error blocking user: " + this.report.id);
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
