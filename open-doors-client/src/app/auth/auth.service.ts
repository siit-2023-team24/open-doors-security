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
  
  getId(): string {
    return this.keycloakService.getId();
  }

  getUsername(): string {
    let token = this.keycloakService.keycloak.token || "";
    if (!token)
      return "";
    const decodedToken = this.helper.decodeToken(token);
    return decodedToken.preferred_username || decodedToken.username || null;
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
    return this.keycloakService.keycloak.authenticated || false;
  }

  async logout() {
    await this.keycloakService.logout();
  }
}
