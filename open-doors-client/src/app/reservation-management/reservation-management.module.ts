import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationRequestGuestPageComponent } from './reservation-request-guest-page/reservation-request-guest-page.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../infrastucture/material/material.module';
import { ReservationRequestCardComponent } from './reservation-request-card/reservation-request-card.component';
import { ReservationRequestHostCardComponent } from './reservation-request-host-card/reservation-request-host-card.component';



@NgModule({
  declarations: [
    ReservationRequestGuestPageComponent,
    ReservationRequestCardComponent,
    ReservationRequestHostCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ]
})
export class ReservationManagementModule { }
