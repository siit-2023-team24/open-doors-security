import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSummary } from '../model/user-summary';
import { UserService } from '../user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {

  @Input()
  user: UserSummary = {id: 0, username: "", firstName: "", lastName: "", role: ""};

  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  constructor(private service: UserService,
    private dialog: MatDialog, private snackBar: MatSnackBar) {}

  dialogUnblock(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { question: "Are you sure you wish to unblock this user?" }
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) this.unblock();
      }
    })
  }

  unblock(): void {
    this.service.unblock(this.user.id).subscribe({
      next: () => {
        this.showSnackBar("Unblocked user");
        console.log("Unblocked user " + this.user.id)
        this.reload.emit(this.user.id);
      },
      error: (error) => {
        console.error("Error unblocking user: " + this.user.id);
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
