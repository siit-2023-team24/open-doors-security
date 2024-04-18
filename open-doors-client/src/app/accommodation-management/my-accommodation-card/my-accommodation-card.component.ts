import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageService } from 'src/app/image-management/image.service';
import { AccommodationService } from '../accommodation.service';
import { HostListAccommodation } from '../model/host-list-accommodation.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-accommodation-card',
  templateUrl: './my-accommodation-card.component.html',
  styleUrls: ['./my-accommodation-card.component.css', '../../../styles.css']
})
export class MyAccommodationCardComponent {


  @Input()
  accommodation: HostListAccommodation;

  @Input()
  pending: boolean;
  //for active accommodations: id is accommodation id, accommodationId is undefined

  id: number | undefined;
  accommodationId: number | undefined;

  imagePath: string;

  @Output()
  reload: EventEmitter<number> = new EventEmitter();
  
  constructor(private service: AccommodationService, private imageService: ImageService,
    private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.imagePath = this.imageService.getPath(this.accommodation.image, false);
    if (!this.pending) {
      this.id = undefined;
      this.accommodationId = this.accommodation.id;
    } else {
      this.id = this.accommodation.id;
      this.accommodationId = this.accommodation.accommodationId;
    }
  }

  openDialog(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      question: "Are you sure you wish to delete this accommodation?"
    }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) this.onDelete();
      }
    })
  }


  onDelete() {
    console.log("deleting accommodation");

    if (this.pending) {
      this.service.deletePending(this.accommodation.id).subscribe({
        next: () => {
          this.reload.emit(this.accommodation.id);
          console.log('Deleted pending accommodation with id: ' + this.accommodation.id);
        },
        error: () => console.log("Error deleting pending accommodation: " + this.accommodation.id)
      })

    }
    else {
      this.service.delete(this.accommodation.id).subscribe({
        next: () => {
          this.reload.emit(this.accommodation.id);
          console.log('Deleted accommodation with id: ' + this.accommodation.id);
        },
        error: (error) => {
          console.error("Error deleting active accommodation: " + this.accommodation.id);
          console.log(error.error.message);
          this.showSnackBar(error.error.message);
        }
      });
    }

  }

  onEdit() {
    console.log("Edit acc.");
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

}
