import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HostListAccommodation } from '../model/host-list-accommodation.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccommodationService } from '../accommodation.service';
import { ImageService } from 'src/app/image-management/image.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-pending-accommodation-card',
  templateUrl: './pending-accommodation-card.component.html',
  styleUrls: ['./pending-accommodation-card.component.css']
})
export class PendingAccommodationCardComponent {

  
  @Input()
  accommodation: HostListAccommodation;

  imagePath: string;

  @Output()
  reload: EventEmitter<number> = new EventEmitter();

  approveQuestion: string = "Are you sure you wish to approve this pending accommodation and activate it?";
  denyQuestion: string = "Are you sure you wish to deny this pending accommodation and delete it?";
  

  constructor(private service: AccommodationService, private imageService: ImageService,
    private dialog: MatDialog) {
  }

  
  ngOnInit() {
    this.imagePath = this.imageService.getPath(this.accommodation.image, false);
  }

  openDialog(message: string, activate: boolean) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { question: message }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (!answer) return;

        if (activate) this.onApprove();
        else this.onDeny();
      }
    });
    
  }

  onApprove() {
    this.service.approvePending(this.accommodation).subscribe({
      next: () => {
        this.reload.emit(this.accommodation.id);
        console.log('Approved pending accommodation with id: ' + this.accommodation.id);
      },
      error: () => console.error('Error approving pending accommodation with id: ' + this.accommodation.id)
    });
  }

  onDeny() {
    this.service.deletePending(this.accommodation.id).subscribe({
      next: () => {
        this.reload.emit(this.accommodation.id);
        console.log('Deleted pending accommodation with id: ' + this.accommodation.id);
      },
      error: () => console.log("Error deleting pending accommodation: " + this.accommodation.id)
    })
  }

  
}
