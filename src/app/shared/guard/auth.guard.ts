import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from 'src/app/services/auth.service';
import {TokenStorageService} from "../../services/token-storage.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private token: TokenStorageService,
    private authServ: AuthService,
    private router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // access token 是否有值
    if (this.token.getToken()) {
      return true; // 允許訪問受保護的路由
    } else {
      Swal.fire({
        title: '請重新登入!',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1500,
      })
      return this.router.createUrlTree(['/login']); // 返回UrlTree以重定向到登錄頁面
    }
  }
}
