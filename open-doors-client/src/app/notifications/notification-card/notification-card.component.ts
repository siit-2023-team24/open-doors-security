import { Component, Input } from '@angular/core';
import { Notification } from '../model/notification';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent {

  @Input()
  notification: Notification = {type: "", message: "", timestamp: 0};

  constructor() {}
  

}
