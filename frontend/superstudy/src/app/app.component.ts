import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { FlashcardsService } from './_services/flashcards.service';
import { StudentsService } from './_services/students.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { MatDrawer } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  title = 'superstudy';
  public roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showTeacherBoard = false;
  showUserBoard = false;
  errorMessage = '';
  login?: string;
  points?: number;
  closeResult = '';
  selectedLevel: string = 'Szkoła podstawowa';
  selectedSubject: string = 'Język angielski';
  name: string = '';
  SetFailed = false;
  allClasses = [];
  getAllClassesSubscription;
  classId;
  isTeacher = false;
  setData = {};
  constructor(
    private tokenStorageService: TokenStorageService,
    private modalService: NgbModal,
    private router: Router,
    private flashcardsService: FlashcardsService,
    private studentsService: StudentsService
  ) {}
  selectChangeHandlerLevel(event: any) {
    //update the ui
    this.selectedLevel = event.target.value;
  }
  selectChangeHandlerSubject(event: any) {
    //update the ui
    this.selectedSubject = event.target.value;
  }
  ngOnInit(): void {
    this.loggedIn();
  }

  loggedIn(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log(this.tokenStorageService.getUser());
    if (this.isLoggedIn) {
      console.log('test 1');
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLES_MODERATOR');
      this.login = user.login;
      this.points = user.points;
      if (this.roles.includes('ROLE_TEACHER')) {
        this.isTeacher = true;
        this.getAllClasses();
      } else {
        this.isTeacher = false;
      }
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
    this.router.navigate([`login`]);
    //window.location.reload();
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

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        //  (result)
        //   => {
        //   this.closeResult = `Closed with: ${result}`;
        // },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  exit(): void {
    this.errorMessage = '';
    this.name = '';
    this.modalService.dismissAll();
    this.SetFailed = false;
  }
  onSubmit(): void {
    if (this.roles.includes('ROLE_TEACHER')) {
      this.setData = {
        name: this.name,
        level: this.selectedLevel,
        subject: this.selectedSubject,
        classId: this.classId,
      };
    } else {
      this.setData = {
        name: this.name,
        level: this.selectedLevel,
        subject: this.selectedSubject,
      };
    }
    console.log(this.setData);
    this.flashcardsService.addSet(this.setData).subscribe(
      (data) => {
        console.log(data);
        this.modalService.dismissAll();
        this.name = '';
        this.errorMessage = '';
        this.router.navigate([`set-menu/${data.id}`]).then(() => {
          window.location.reload();
        });
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.SetFailed = true;
      }
    );
  }

  moveToSets(): void {
    this.router.navigate([`all-sets`]);
  }

  moveToSuperStudy(): void {
    this.router.navigate([`super-study-sets`]);
  }

  moveToStatistics(): void {
    this.router.navigate([`statistics`]);
  }

  moveToClasses(): void {
    this.router.navigate([`all-classes`]);
  }

  moveToProfile(): void {
    this.router.navigate([`profile`]);
  }

  moveToCreateClass(): void {
    this.router.navigate([`create-class`]);
  }

  moveToAddTask(): void {
    this.router.navigate([`add-task`]);
  }

  moveToCreateSet(): void {
    this.router.navigate([`create-set`]);
  }

  getAllClasses() {
    this.getAllClassesSubscription = this.studentsService
      .getClassesList()
      .subscribe((allClasses) => {
        this.allClasses = allClasses;
        console.log(this.allClasses);
      });
  }

  getClassId(id: number) {
    console.log(id);
    this.classId = id;
  }

  toggleDrawer() {
    this.drawer.toggle();
  }
}
