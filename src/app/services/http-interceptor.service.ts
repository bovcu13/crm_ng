import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, retry, Subject, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {TokenStorageService} from "./token-storage.service";
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';

const TOKEN_HEADER_KEY = 'Authorization'

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private expired$ = new Subject();

  constructor(
    private authServ: AuthService,
    private storageServ: TokenStorageService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `${this.storageServ.getToken()}`,
        'content-type': 'application/x-www-form-urlencoded'
      }
    });

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      if (error instanceof HttpErrorResponse && !request.url.includes('login') && error.status === 401) {
        return this.handle401Error(request, next) as Observable<HttpEvent<any>>;
      }
      return throwError(error);
    }))
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.storageServ.getRefreshToken();
      if (token)
        if (this.storageServ.getUser()) {
          return this.authServ.refreshToken(token).pipe(retry(3), tap(res => {
              // if (res.body.unaccess_count || res.body.unaccess_count === 0) {
              //   this.authServ.saveUnaccessCount(res.body.unaccess_count);
              // }
            }
          )).pipe(tap(res=>{
            console.log(res)
            }),
            switchMap((token: any) => {
              this.isRefreshing = false;
              this.storageServ.saveToken(token.body.access_token);
              this.refreshTokenSubject.next(token.body.access_token);

              return next.handle(this.addTokenHeader(request, token.body.access_token)).pipe(tap());
            }),
            catchError((err) => {
              this.isRefreshing = false;
              // this.blockServ.setStatus(false);
              if (err.status === 401) {
                this.authServ.signOut();
              }
              return throwError(err);
            })
          );
        } else {
          return this.authServ.refreshToken(token).pipe(retry(3), tap(res => {
              // if (res.body.unaccess_count || res.body.unaccess_count === 0) {
              //   this.authServ.saveUnaccessCount(res.body.unaccess_count);
              // }
            }
          )).pipe(
            switchMap((token: any) => {
              this.isRefreshing = false;
              this.storageServ.saveToken(token.body.access_token);
              this.refreshTokenSubject.next(token.body.access_token);

              return next.handle(this.addTokenHeader(request, token.body.access_token)).pipe(tap());
            }),
            catchError((err) => {
              this.isRefreshing = false;
              // this.blockServ.setStatus(false);
              if (err.status === 401) {
                this.authServ.signOut();
              }
              return throwError(err);
            })
          );
        }
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({headers: request.headers.set(TOKEN_HEADER_KEY, token)});
  }

}
