import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

import { TokenStorageService } from '../_services/token-storage.service';
import {
  Router
} from "@angular/router";


@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.scss'],
})
export class BoardUserComponent implements OnInit {
  form: any = {
    first_name: null,
    last_name: null
    
  };
  private roles: string;
  isSuccessful = false;
  content?: string;
  constructor(private userService: UserService, private tokenStorageService: TokenStorageService, private router: Router) {}
  
  ngOnInit(): void {
    const user = this.tokenStorageService.getUser();
    this.roles = user.roles;
    if (this.roles.includes('ROLE_TEACHER')){
      this.router.navigate(['/teacher']);
  }
  
    
    
    this.userService.getUserBoard().subscribe(
      (data) => {
        this.content = data;
      },
      (err) => {
        this.content = err.message;
      }
    );
  }
  onSubmit(): void {
   
  }
}
