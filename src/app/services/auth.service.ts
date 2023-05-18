import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const AUTH_API = 'https://api.t.d2din.com';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  // 登入
  login(body: any): Observable<any> {
    const url = `${AUTH_API}/crm/v1.0/login`;
    return this.http.post(url, body, httpOptions);
  }

  // 登出
  signOut(): void {
    window.sessionStorage.clear();
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + '/crm/v1.0/signin', {
      username,
      email,
      password
    }, httpOptions);
  }


  refreshToken(token: string) {
    const url = `${AUTH_API}/crm/v1.0/refresh`;
    return this.http.post(url, {refresh_token: token}, httpOptions);
  }
}
