import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { KeycloakService } from '../keycloak/keycloak.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private keycloakService: KeycloakService) { }

  helper: JwtHelperService = new JwtHelperService();
  
  getId(): number {
    // return this.keycloakService.getId();
    return 2;
    // return this.helper.decodeToken(localStorage.getItem('user') || '').id;
    
  }

  getUsername(): string {
    let token = this.keycloakService.keycloak.token || "";
    if (!token)
      return "";
    const decodedToken = this.helper.decodeToken(token);
    return decodedToken.prefered_username || decodedToken.username || null;
    // return this.helper.decodeToken(localStorage.getItem('user') || '').sub;
  }

  getRole() : string {
    // if(!this.isLoggedIn()) return "";
    // return this.helper.decodeToken(localStorage.getItem('user') || '').role;
    if (this.keycloakService.keycloak.hasRealmRole("admin"))
      return "ROLE_ADMIN";
    if (this.keycloakService.keycloak.hasRealmRole("host"))
      return "ROLE_HOST";
    if (this.keycloakService.keycloak.hasRealmRole("guest"))
      return "ROLE_GUEST";
    return "";

  }

  isLoggedIn(): boolean {
    // return localStorage.getItem('user')!=null;
    return this.keycloakService.keycloak.authenticated || false;
  }

  logout(): void {
    // localStorage.removeItem('user');
    this.keycloakService.logout();
  }
}
