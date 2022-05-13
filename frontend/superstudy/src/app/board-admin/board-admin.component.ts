import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import {
  Router
} from "@angular/router";
@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss'],
})
export class BoardAdminComponent implements OnInit {
  content?: string;
  constructor(private userService: UserService, private tokenStorageService: TokenStorageService, private router: Router) {}
  private roles: string;
  ngOnInit(): void {
    const user = this.tokenStorageService.getUser();
    this.roles = user.roles;
    if (this.roles.includes('ROLE_USER')){
      this.router.navigate(['/user']);
      }
  if (this.roles.includes('ROLE_TEACHER')){
    this.router.navigate(['/teacher']);
      }
    this.userService.getAdminBoard().subscribe(
      (data) => {
        this.content = data;
      },
      (err) => {
        this.content = err.message;
      }
    );
  }
}
