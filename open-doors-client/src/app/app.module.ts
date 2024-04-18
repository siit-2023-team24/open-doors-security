import { NgModule } from '@angular/core';
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
    NotificationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }