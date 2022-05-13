import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';

import {
  Router
} from "@angular/router";
@Component({
  selector: 'app-board-teacher',
  templateUrl: './board-teacher.component.html',
  styleUrls: [],
})

export class BoardTeacherComponent implements OnInit {
  content?: string;
  constructor(private userService: UserService,private tokenStorageService: TokenStorageService, private router: Router) {}
  private roles: string;
  ngOnInit(): void {
    const user = this.tokenStorageService.getUser();
    this.roles = user.roles;
    if (this.roles.includes('ROLE_USER')){
      this.router.navigate(['/user']);
  }
  
    this.userService.getTeacherBoard().subscribe(
      (data) => {
        this.content = data;
      },
      (err) => {
        this.content = err.message;
      }
    );
  }
}
