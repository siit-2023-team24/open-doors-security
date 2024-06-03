import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from "rxjs"
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UserTokenState } from './model/user-token-state.model';
import { Account } from './model/account';
import { environment } from "../../env/env";
import { EditUser } from './model/edit-user.model';
import { NewPasswordDTO } from './model/newPasswordDTO';
import { UserAccount } from './model/user-account.model';
import { catchError } from 'rxjs/operators';
import { UserSummary } from './model/user-summary';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    skip: 'true',
  });

  user$ = new BehaviorSubject("");
  userState = this.user$.asObservable();

  constructor(private httpClient: HttpClient) { }


  login(auth: Account): Observable<UserTokenState> {
    return this.httpClient.post<UserTokenState>(environment.apiHost + '/auth/login', auth, {
      headers: this.headers,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') != null;
  }

  register(user: UserAccount): Observable<UserAccount> {
    return this.httpClient.post<UserAccount>(environment.apiHost + '/auth/register', user, {
      headers: this.headers,
    });
  }

  activateUser(ip: string, id: string): Observable<String> {
    return this.httpClient.post<String>('http://' + ip +':9090/open-doors/auth/activate-user/' + id, null, {headers: this.headers});
  }
  
  getUser(id: string): Observable<EditUser> {
    return this.httpClient.get<EditUser>(environment.apiHost + '/users/' + id);
  }

  updateUser(formData: FormData): Observable<EditUser> {
    return this.httpClient.put<EditUser>(environment.apiHost + '/users', formData);
  }

  changePassword(dto: NewPasswordDTO): Observable<NewPasswordDTO> {
    return this.httpClient.put<NewPasswordDTO>(environment.apiHost + '/users/new-password', dto);
  }

  delete(id: string): Observable<Object> {
    return this.httpClient.delete(environment.apiHost + '/users/' + id);
  }

  getBlocked(): Observable<UserSummary[]> {
    return this.httpClient.get<UserSummary[]>(environment.apiHost + '/users/blocked');
  }

  unblock(id: string): Observable<Object> {
    return this.httpClient.get(environment.apiHost + '/users/unblock/' + id);
  }
}
