import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user-management/login/login.component';
import { RegisterComponent } from './user-management/register/register.component';
import { HomePageComponent } from './accommodation-management/home-page/home-page.component';
import { AccommodationPageComponent } from './accommodation-management/accommodation-page/accommodation-page.component';
import { ProfileComponent } from './user-management/profile/profile.component';
import { ProfileEditComponent } from './user-management/profile-edit/profile.edit.component';
import { ChangePasswordComponent } from './user-management/change-password/change-password.component';
import { MyAccommodationsComponent } from './accommodation-management/my-accommodations/my-accommodations.component';
import { CreateAccommodationComponent } from './accommodation-management/create-accommodation/create-accommodation.component';
import { AccountActivationComponent } from './user-management/account-activation/account-activation.component';
import { AuthGuard } from './auth/guard';
import { PendingAccommodationsComponent } from './accommodation-management/pending-accommodations/pending-accommodations.component';
import { ReservationRequestGuestPageComponent } from './reservation-management/reservation-request-guest-page/reservation-request-guest-page.component';
import { FavoritesPageComponent } from './accommodation-management/favorites-page/favorites-page.component';
import { HostReviewsComponent } from './review-management/host-reviews/host-reviews.component';
import { FinancialReportPageComponent } from './financial-report-management/financial-report-page/financial-report-page.component';
import { ReportUserComponent } from './user-management/report-user/report-user.component';
import { ReviewsAdminPageComponent } from './review-management/reviews-admin-page/reviews-admin-page.component';
import { UserReportsComponent } from './user-management/user-reports/user-reports.component';
import { NotificationsComponent } from './notifications/notifications/notifications.component';

const routes: Routes = [
    {component: LoginComponent, path:"login"},
    {component: RegisterComponent, path:"register"},
    {component: HomePageComponent, path:"home"},
    {component: ProfileComponent, path:"profile", canActivate: [AuthGuard], data : {role: ['ROLE_ADMIN', 'ROLE_HOST', 'ROLE_GUEST']}},
    {component: ProfileEditComponent, path:"edit-profile", canActivate: [AuthGuard], data : {role: ['ROLE_ADMIN', 'ROLE_HOST', 'ROLE_GUEST']}},
    {component: ChangePasswordComponent, path:"edit-profile/change-password", canActivate: [AuthGuard], data : {role: ['ROLE_ADMIN', 'ROLE_HOST', 'ROLE_GUEST']}},
    {component: MyAccommodationsComponent, path:"my-accommodations", canActivate: [AuthGuard], data : {role: ['ROLE_HOST']}},
    {component: CreateAccommodationComponent, path:"create-accommodation/:id/:accommodationId", canActivate: [AuthGuard], data : {role: ['ROLE_HOST']}},
    {component: AccountActivationComponent, path:"activate-account"},
    {component: AccommodationPageComponent, path:"accommodation/:id/:accommodationId"},
    {component: PendingAccommodationsComponent, path: "pending-accommodations", canActivate: [AuthGuard], data : {role: ['ROLE_ADMIN']}},
    {component: ReservationRequestGuestPageComponent, path: "reservation-requests", canActivate: [AuthGuard], data: {role: ['ROLE_GUEST', 'ROLE_HOST']}},
    {component: FavoritesPageComponent, path:"favorites", canActivate: [AuthGuard], data : {role: ['ROLE_GUEST']}},
    {component: HostReviewsComponent, path:"host-reviews/:hostId"},
    {component: FinancialReportPageComponent, path:"financial-reports", canActivate: [AuthGuard], data : {role: ['ROLE_HOST']}},
    {component: ReportUserComponent, path:"report-users", canActivate: [AuthGuard], data : {role: ['ROLE_GUEST', 'ROLE_HOST']}},
    {component: UserReportsComponent, path: "user-reports", canActivate: [AuthGuard], data: {role: ['ROLE_ADMIN']}},
    {component: ReviewsAdminPageComponent, path: "reviews", canActivate: [AuthGuard], data : {role: ['ROLE_ADMIN']}},
    {component: NotificationsComponent, path: "notifications", canActivate: [AuthGuard], data: {role: ['ROLE_ADMIN', 'ROLE_HOST', 'ROLE_GUEST']}},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }