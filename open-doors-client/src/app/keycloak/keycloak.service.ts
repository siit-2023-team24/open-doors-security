import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;
  private _profile: UserProfile | undefined;
  
  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:8080',
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

    this.keycloak.init({
      onLoad: 'login-required', // Use check-sso instead of login-required
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' // Optional: Use this for silent SSO
    }).then(authenticated => {
      if (authenticated) {
        console.log('User is authenticated');
        this._profile = (this.keycloak.loadUserProfile()) as UserProfile;
        this._profile.token = this.keycloak.token || '';
      } else {
        console.log('User is not authenticated');
        // Perform actions for non-authenticated users
      }
    }).catch(err => {
      console.error('Failed to initialize Keycloak', err);
    });

  }

  login() {
    return this.keycloak?.login();
  }

  logout() {
    // this.keycloak.accountManagement();
    return this.keycloak?.logout();
  }

  openAccountManagement() {
    return this.keycloak?.accountManagement();
  }

}
