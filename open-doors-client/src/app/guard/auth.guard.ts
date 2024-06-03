import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {KeycloakService} from '../keycloak/keycloak.service';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const tokenService = inject(KeycloakService);
  const router = inject(Router);
  const authService = inject(AuthService);
  let role: string = "NONE";
  if (authService.getRole()) {
    role = authService.getRole();
    if (tokenService.keycloak.isTokenExpired()) {
      console.log("REFRESH")
      tokenService.refreshToken();
    }
  }
  if (!route.data['role'].includes(role)) {
    router.navigate(['home']);
    return false;
  }
  return true;
};