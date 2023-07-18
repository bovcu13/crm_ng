import {Injectable} from '@angular/core';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';
const LOGIN_TIME_KEY = 'login-time';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() {
  }

  // 刪除並儲存accessToken
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  // 取得accessToken
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  // 刪除並儲存refreshToken
  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  // 取得refreshToken
  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  // 刪除並儲存loginTime
  public settingSession(token: string, time: string): void {
    window.sessionStorage.removeItem(LOGIN_TIME_KEY);
    window.sessionStorage.setItem(LOGIN_TIME_KEY, token);
  }

  // 取得loginTime
  public getSession(token: string): string | null {
    return window.sessionStorage.getItem(LOGIN_TIME_KEY);
  }

  // 紀錄時間到session
  setTime(date = new Date()) {
    let time = new Date(date).getTime().toString();
    this.settingSession(LOGIN_TIME_KEY, time);
  }

  // 取得紀錄時間
  getTime(): string | null {
    return this.getSession(LOGIN_TIME_KEY) || '';
  }

  // 檢查時間是否超過登入時間*分鐘 預設5分鐘
  refreshTokenIfTimeOver(min = 5, time = new Date()) {
    let loginTime: any = this.getTime();
    let diff = time.getTime() - Number(loginTime);
    let minutes = Math.floor(diff / (60 * 1000));
    return minutes >= min
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
