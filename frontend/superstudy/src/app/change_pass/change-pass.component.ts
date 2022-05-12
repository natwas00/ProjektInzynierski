import { Component, OnInit } from '@angular/core';
import {DataService} from "src/app/_services/updateAndDel.service"
import {Change_pass} from "src/app/models/change_passs.model"
import { TokenStorageService } from '../_services/token-storage.service';
import { FormGroup} from "@angular/forms";

@Component({
    selector:'app-change-pass',
    templateUrl: './change-pass.component.html',
    styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit{
    currentUser: Change_pass= {
        old_password: '',
        new_password1: '',
        new_password2: ''
    }
    message = '';
    hide: boolean = true;
    constructor(
        private token: TokenStorageService,

        private changePassService: DataService,
        ) { }
        public showPassword: boolean ;
        public showPassword2: boolean ;
        public showPassword3: boolean ;
        registrationForm: FormGroup;
    ngOnInit(): void {
            this.currentUser = this.token.getUser();
         
          }
        
        
          updatePass(): void{
              this.message = '';
              this.changePassService.update(this.currentUser)
              .subscribe(
                
                response => {
                  console.log(response);
                  this.message = response.message ? response.message : 'Hasło zostało pomyślnie zmienione!';
                  this.currentUser.new_password1=""
                  this.currentUser.new_password2=""
                  this.currentUser.old_password=""
                },
                error => {
                  console.log(error);
                  
                  this.message = error.error.message;
                });
          }
}