import { Injectable, OnInit } from '@angular/core';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

  constructor(private keycloak: KeycloakService) {
    this.keycloak.isLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        this.keycloak.getKeycloakInstance().loadUserProfile();
      }
    });
  }

  ngOnInit() {
    // this.keycloak.keycloakEvents$.subscribe({
    //   next: (event) => {
    //     if (event.type === KeycloakEventType.OnTokenExpired) {
    //       this.keycloak.updateToken(20).then((refreshed) => {
    //         if (refreshed) {
    //           console.log('Token refreshed');
    //         } else {
    //           console.log('Token not refreshed, user needs to re-login');
    //         }
    //       }).catch((error) => {
    //         console.error('Failed to refresh token', error);
    //       });
    //     }
    //   }
    // });
  }

  public logout(): void {
    this.keycloak.logout("http://localhost:4200/").then();
  }

  login() {
    this.keycloak.login();
  }


  isLoggedIn(): Promise<boolean> {
    return this.keycloak.isLoggedIn();
  }

  getUsername(): string {
    return this.keycloak.getKeycloakInstance()?.profile?.username as string;
  }

  getId(): string {
    return this.keycloak?.getKeycloakInstance()?.profile?.id as string;
  }

  getTokenExpirationDate(): number {
    return (this.keycloak.getKeycloakInstance().refreshTokenParsed as { exp: number })['exp'] as number;
  }

  refresh(): Observable<any> {
    return from(this.keycloak.getKeycloakInstance().updateToken(1800));
  }

  isExpired(): boolean {
    return this.keycloak.getKeycloakInstance().isTokenExpired();
  }
}
