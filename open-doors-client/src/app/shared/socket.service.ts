import { Injectable } from '@angular/core';
import { Message } from './model/notification';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { environment } from 'src/env/env';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private serverUrl = environment.apiHost + '/socket'
  private stompClient: any;
  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: Message[] = [];


  constructor(private snackBar: MatSnackBar, private authService: AuthService) {}

  ngOnInit() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openGlobalSocket()
      that.openSocket();
    });

  }

  sendMessageUsingSocket(message: Message) {
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
  }

  openGlobalSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe("/socket-publisher", (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }

  openSocket() {
    if (this.isLoaded && localStorage.getItem('user')) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe("/socket-publisher/" + this.authService.getUsername(), (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }

  closeSockets() {
    this.stompClient.disconnect();
    this.initializeWebSocketConnection();
  }

  handleResult(message: { body: string; }) {
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      this.showSnackBar(messageResult.message);
      this.messages.push(messageResult);
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open("New notification: " + message, 'Close', {
      duration: 4000,
    });
  }

}
