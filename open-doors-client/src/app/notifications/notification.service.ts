import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from './model/notification';
import { environment } from 'src/env/env';
import { NotificationType } from './model/notification.type';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient) { }

  getAllFor(id: string): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(environment.apiHost + '/users/' + id + '/notifications');
  }

  getDisabledFor(id: string): Observable<NotificationType[]> {
    return this.httpClient.get<NotificationType[]>(environment.apiHost + '/users/' + id + '/disabled-notifications');
  }

  setDisabledFor(id: string, types: NotificationType[]): Observable<Object> {
    return this.httpClient.put(environment.apiHost + '/users/' + id + '/disabled-notifications', types);
  }
}
