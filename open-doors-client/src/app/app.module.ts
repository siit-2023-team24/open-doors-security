import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { UserManagementModule } from './user-management/user-management.module';
import { AccommodationManagementModule } from './accommodation-management/accommodation-management.module';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './user-management/interceptor';
import { ReservationManagementModule } from './reservation-management/reservation-management.module';
import { FinancialReportManagementModule } from './financial-report-management/financial-report-management.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SecurityModule } from './security/security.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'OpenDoorsRealm',
        clientId: 'OpenDoors'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      },
      // shouldAddToken: (request) => {
      //   const { method, url } = request;
    
      //   const isGetRequest = 'GET' === method.toUpperCase();
      //   const acceptablePaths = ['/assets', '/clients/public'];
      //   const isAcceptablePathMatch = acceptablePaths.some((path) =>
      //     url.includes(path)
      //   );
    
      //   return !(isGetRequest && isAcceptablePathMatch);
      // }
    });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    UserManagementModule,
    AccommodationManagementModule,
    SharedModule,
    ReservationManagementModule,
    FinancialReportManagementModule,
    NotificationsModule,
    SecurityModule,
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }