import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {RouterModule} from "@angular/router";
import { MaterialModule } from '../infrastucture/material/material.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile.edit.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { UserReportsComponent } from './user-reports/user-reports.component';
import { WriteReportCardComponent } from './write-report-card/write-report-card.component';
import { ReportUserComponent } from './report-user/report-user.component';
import { FormsModule } from '@angular/forms';
import { UserReportCardComponent } from './user-report-card/user-report-card.component';
import { UserCardComponent } from './user-card/user-card.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ProfileEditComponent,
    ChangePasswordComponent,
    AccountActivationComponent,
    UserReportsComponent,
    WriteReportCardComponent,
    ReportUserComponent,
    UserReportCardComponent,
    UserCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ProfileEditComponent,
    ChangePasswordComponent,
    UserReportsComponent,
    WriteReportCardComponent,
    ReportUserComponent
  ]
})
export class UserManagementModule { }
