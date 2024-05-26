import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from './shared/socket.service';
import { AuthService } from './keycloak/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy{
  title: string = 'Open Doors';
  private routeSubscription: Subscription;

  
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private socketService: SocketService, private authService: AuthService) {
    this.routeSubscription = this.router.events.subscribe((event)=> {
      if (event instanceof NavigationEnd) {
        this.title = this.activatedRoute.snapshot.firstChild?.queryParamMap.get('title') || 'Open Doors';
      }
    });
    socketService.initializeWebSocketConnection();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
