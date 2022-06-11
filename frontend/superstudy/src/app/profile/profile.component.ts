import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { NgbModal, ModalDismissReasons }
  from '@ng-bootstrap/ng-bootstrap';
import { DataService } from "src/app/_services/updateAndDel.service"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  constructor(private token: TokenStorageService,
    private modalService: NgbModal,
    private changePassService: DataService) { }
  closeResult = '';
  open(content) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then(
        //  (result) 
        //   => {
        //   this.closeResult = `Closed with: ${result}`;
        // }, 
        (reason) => {
          this.closeResult =
            `Dismissed ${this.getDismissReason(reason)}`;
        });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  deleteUser(): void {
    this.changePassService.delete().subscribe(
      response => {
        console.log(response);
        this.logout()
      },
      error => {
        console.log(error);
      });
  }
  ngOnInit(): void {
    this.currentUser = this.token.getUser();

  }
  logout(): void {
    this.token.signOut();
    //  window.location.reload();
    window.location.replace("/home")
  }

  getUserRole(): string {
    if (this.currentUser.roles.includes('ROLE_USER')) {
      return "Student"
    }
    if (this.currentUser.roles.includes('ROLE_TEACHER')) {
      return "Teacher"
    }

    return "Error geting student role"
  }
}
