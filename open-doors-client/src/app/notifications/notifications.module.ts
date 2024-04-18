import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { MaterialModule } from '../infrastucture/material/material.module';



@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NotificationsComponent
  ]
})
export class NotificationsModule { }
