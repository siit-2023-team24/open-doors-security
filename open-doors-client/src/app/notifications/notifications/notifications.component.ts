import { Component } from '@angular/core';
import { Notification } from '../model/notification';
import { NotificationService } from '../notification.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationType } from '../model/notification.type';
import { MatSlideToggleChange, MatSlideToggleDefaultOptions } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  notifications: Notification[] = [];
  noData: string = "";

  role: string = "";
  disabled: NotificationType[] = [];

  types: { [key: string]: boolean } = {};
  allTypes: NotificationType[] = [NotificationType.NEW_RESERVATION_REQUEST, 
                                  NotificationType.RESERVATION_REQUEST,
                                  NotificationType.HOST_REVIEW,
                                  NotificationType.ACCOMMODATION_REVIEW];

  constructor(private service: NotificationService,
              private authService: AuthService,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const id: string = this.authService.getId();
    this.role = this.authService.getRole();
    this.service.getAllFor(id).subscribe({
      next: (data: Notification[]) => {
        this.notifications = data;
        if (data.length == 0)
          this.noData = "You do not have any notifications yet.";
      },
      error: () => console.error('Error getting notifications')
    });

    this.service.getDisabledFor(id).subscribe({
      next: (data: NotificationType[]) => { 
        this.disabled = data; 
        console.log('disabled', this.disabled);
        this.initToggles();
       },
      error: () => console.error('Error getting disabled notifications for user')
    })
  }

  initToggles(): void {
    if (this.disabled == null)
      this.disabled = [];

    for (let type of this.allTypes) {
      let typeValue = NotificationType[type as unknown as keyof typeof NotificationType];
      let isTypeDisabled = this.disabled.includes(typeValue);
      this.types[type] = !isTypeDisabled;
    }
  }

  setToggle(i: number, e: MatSlideToggleChange): void {
    if (e.checked)
      this.types[this.allTypes[i]] = true;
    else
      this.types[this.allTypes[i]] = false;
  }

  saveSettings(): void {
    this.disabled = [];
    for (let type of this.allTypes)  {
      if (!this.types[type])
        this.disabled.push(type);
    }
    console.log(this.disabled);

    this.service.setDisabledFor(this.authService.getId(), this.disabled).subscribe({
      next: () => {
        console.log('Set notification settings');
        this.showSnackBar("Settings saved");
      },
      error: () => console.error('Error setting notification settings')
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

}

