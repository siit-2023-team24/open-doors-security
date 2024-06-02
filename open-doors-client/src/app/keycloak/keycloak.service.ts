import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from './user-profile';
import { environment } from 'src/env/env';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;
  private _profile: UserProfile | undefined;

  constructor(private http: HttpClient) {}

  helper: JwtHelperService = new JwtHelperService();
  
  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://127.0.0.1:8080',
        realm: 'OpenDoorsKeycloak',
        clientId: 'OpenDoors'
      });
    }
    return this._keycloak;
  }

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  async init() {
    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso', // check-sso instead of login-required
    });

    if (authenticated) {
      this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak.token || '';
    }
  }

  login() {
    return this.keycloak?.login();
  }

  logout() {
    return this.keycloak?.logout();
  }

  openAccountManagement() {
    return this.keycloak?.accountManagement();
  }

  getId(): number{
    return 0;
  }

  getUsername(): string {
    let token = this.keycloak.token || "";
    if (!token)
      return "";
    const decodedToken = this.helper.decodeToken(token);
    return decodedToken.prefered_username || decodedToken.username || null;
    // return this.helper.decodeToken(localStorage.getItem('user') || '').sub;
  }

  sendIdRequest(): Observable<number> {
    const username = this.getUsername();
    return this.http.get<number>(environment.apiHost + "/users/id/" + username);
  }

}
