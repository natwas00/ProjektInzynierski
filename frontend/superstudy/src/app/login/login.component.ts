import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: any = {
    login: null,
    password: null,
  };
  submitPressed = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  user: any;

  constructor(
    private appComponent: AppComponent,
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.user = this.tokenStorage.getUser();
      this.roles = this.user.roles;

    }
  }

  onSubmit(): void {
    const { login, password } = this.form;
    this.submitPressed = true;
    this.authService.login(login, password).subscribe(
      (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.user = this.tokenStorage.getUser();
        // this.reloadPage();
        this.roles = this.user.roles;
        this.appComponent.isLoggedIn = this.isLoggedIn;
        this.appComponent.login = this.user.login;
        this.navigateToFlashcards();
      },
      (error) => {
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      });
  }

  getError(): String {
    return this.errorMessage;
  }

  resetOnSubmit() {
    this.submitPressed = false;
  }


  navigateToFlashcards() {
    this.router.navigate([`all-sets`]);
  }
}
