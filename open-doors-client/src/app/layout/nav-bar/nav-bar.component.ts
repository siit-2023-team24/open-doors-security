import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { KeycloakService } from 'src/app/keycloak/keycloak.service';
import { SocketService } from 'src/app/shared/socket.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css', "../../../styles.css"]
})
export class NavBarComponent implements OnInit {

  role: string;
  id: string;
  constructor(private router: Router,
              public authService: AuthService,
              private socketService: SocketService,
              private keycloakService: KeycloakService) {
  }


  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {
      this.role = this.authService.getRole();
      this.id = this.authService.getId();
    }
    else {
      this.role = 'NO_USER';
    }

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.ngOnInit();
    });
  }


  async login() {
    await this.keycloakService.login();
  }



  async logout() {
    await this.keycloakService.logout();
  }

  async openAccountManagement() {
    await this.keycloakService.openAccountManagement();
  }

  refreshNavbar() {
    
  }

  printRole() {
    console.log(this.authService.getRole())
  }
}
