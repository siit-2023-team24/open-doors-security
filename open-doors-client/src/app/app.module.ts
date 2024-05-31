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
import { ReservationManagementModule } from './reservation-management/reservation-management.module';
import { FinancialReportManagementModule } from './financial-report-management/financial-report-management.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SecurityModule } from './security/security.module';
import { KeycloakService } from './keycloak/keycloak.service';
import { HttpTokenInterceptor } from './interceptor/http-token.interceptor';


export function kcFactory(kcService: KeycloakService) {
  return () => kcService.init();
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
    SecurityModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakService],
      useFactory: kcFactory,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }