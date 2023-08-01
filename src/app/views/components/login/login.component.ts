import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {TokenStorageService} from "../../../services/token-storage.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('container')
  container!: ElementRef;
  login_form: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  showBack = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: FormBuilder, private router: Router) {
    this.login_form = this.fb.group({
      //必填
      user_name: ['admin', [Validators.required]],
      password: ['12345', [Validators.required]],
      company_id: ['00000000-0000-4000-a000-000000000000', [Validators.required]],
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.isFloating = !this.isFloating;
    }, 1000);
  }

  isFloating: boolean = false;

  onSubmit(): void {
    let body = {
      "user_name": this.login_form.controls['user_name'].value,
      "company_id": this.login_form.controls['company_id'].value,
      "password": this.login_form.controls['password'].value
    }
    this.authService.login(body).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.body.access_token);
        this.tokenStorage.saveRefreshToken(data.body.refresh_token);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        // this.reloadPage();
        Swal.fire({
          title: '登入',
          text: "歡迎您 :)",
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/main']);
        })
      },
      error: err => {
        // 帳密錯誤
        Swal.fire({
          title: '失敗',
          text: "請確認帳密是否正確 :(",
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        })
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  signIn() {
    this.container.nativeElement.classList.remove('right-panel-active');
  }

  signUp() {
    this.container.nativeElement.classList.add('right-panel-active');
  }

  toggleCard() {
    const card = document.querySelector('.card-container');
    this.showBack = !this.showBack;
    if (!this.showBack) {
      card?.classList.remove('flip-front');
    } else {
      card?.classList.add('flip-front');
    }
  }
}

