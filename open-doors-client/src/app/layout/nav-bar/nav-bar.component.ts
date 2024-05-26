import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/keycloak/auth.service';
import { SocketService } from 'src/app/shared/socket.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css', "../../../styles.css"]
})
export class NavBarComponent implements OnInit {

  role: string;
  id: number;
  constructor(private router: Router,
              public authService: AuthService,
              private socketService: SocketService) {
  }


  ngOnInit(): void {

    // if (this.authService.isLoggedIn()) {
    //   this.role = this.authService.getRole();
    //   this.id = this.authService.getId();
    // }
    // else {
    //   this.role = 'NO_USER';
    // }

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.ngOnInit();
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    // localStorage.removeItem('user');
    // this.router.navigate(['login']);
    // this.socketService.closeSockets();
    this.authService.logout();
  }
  refreshNavbar() {
    
  }
}
