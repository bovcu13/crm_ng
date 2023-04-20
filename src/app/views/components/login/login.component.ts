import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../_services/auth.service";
import {TokenStorageService} from "../../../_services/token-storage.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login_form: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: FormBuilder) {
    this.login_form = this.fb.group({
      //必填
      user_name: ['admin', [Validators.required]],
      password: ['12345', [Validators.required]],
      company_id: ['1a8e81ed-8ec7-4cba-831a-77ea4079b3fd', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    let body = {
      "user_name": this.login_form.controls['user_name'].value,
      "company_id": this.login_form.controls['company_id'].value,
      "password": this.login_form.controls['password'].value
    }
    this.authService.login(body).subscribe(
      data => {
        this.tokenStorage.saveToken(data.body.access_token);
        this.tokenStorage.saveRefreshToken(data.body.refresh_token);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
