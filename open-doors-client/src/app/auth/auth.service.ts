import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  helper: JwtHelperService = new JwtHelperService();
  
  getId(): number {
    return this.helper.decodeToken(localStorage.getItem('user') || '').id;
  }

  getUsername(): string {
    return this.helper.decodeToken(localStorage.getItem('user') || '').sub;
  }

  getRole() : string {
    if(!this.isLoggedIn()) return "";
    return this.helper.decodeToken(localStorage.getItem('user') || '').role;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user')!=null;
  }

  logout(): void {
    localStorage.removeItem('user');
  }
}
