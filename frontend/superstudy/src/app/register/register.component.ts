import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  selectedRole: string = '';
  selectChangeHandler(event: any) {
    //update the ui
    this.selectedRole = event.target.value;
  }
  form: any = {
    first_name: null,
    last_name: null,
    email: null,
    login: null,
    password: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const { first_name, last_name, email, login, password } = this.form;

    var roles;
    if (this.selectedRole == 'Nauczyciel') {
      roles = 'teacher';
    } else {
      roles = 'user';
    }
    this.authService
      .register(first_name, last_name, email, login, password, roles)
      .subscribe(
        (data) => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.router.navigate([`login`]);
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      );
  }
}
