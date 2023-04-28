import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../_services/auth.service";
import {TokenStorageService} from "../../../_services/token-storage.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";

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

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: FormBuilder,private router:Router) {
    this.login_form = this.fb.group({
      //必填
      user_name: ['admin', [Validators.required]],
      password: ['12345', [Validators.required]],
      company_id: ['00000000-0000-4000-a000-000000000000', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
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
    this.authService.login(body).subscribe(
      data => {
        console.log(data)
        // 帳密錯誤
        if (data.code === 500){
          return
        }
        console.log(data.body.code)
        this.tokenStorage.saveToken(data.body.access_token);
        this.tokenStorage.saveRefreshToken(data.body.refresh_token);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        // this.reloadPage();
        this.router.navigate(['/main']);
      },
      err => {
        console.log(err)
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
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
}

