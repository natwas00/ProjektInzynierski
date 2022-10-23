import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentsService } from '../_services/students.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { HttpErrorResponse } from '@angular/common/http';
const MOCK_SETS: any[] = [
  {
    id: '1',
    name: 'Kasia',
    stars: 120,
  },
  {
    id: '2',
    name: 'Maciek',
    stars: 117,
  },
  {
    id: '3',
    name: 'Jakub',
    stars: 120,
  },
  {
    id: '4',
    name: 'Patryk',
    stars: 117,
  },
  {
    id: '5',
    name: 'Patryk',
    stars: 117,
  },
];

@Component({
  selector: 'app-class-info',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss'],
})
export class CreateClassComponent implements OnInit, OnDestroy {
  @ViewChild('addClassForm') addClassForm;
  public allSets = [];
  public addClassroomSubscription;
  public errorMessage = '';
  public success = false;
  public user;
  public userId;
  public studentsSet = [];
  public newRow = '';

  constructor(
    private token: TokenStorageService,
    private studentService: StudentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.allSets = MOCK_SETS;
    this.user = this.token.getUser();
    this.userId = this.user.id;
  }

  ngOnDestroy(): void {
    // TODO: anulowanie subskrypcji
  }

  public addStudentToSet() {
    this.studentsSet.unshift(this.newRow);
    this.errorMessage = '';
    this.newRow = '';
    console.log(this.studentsSet);
  }

  public deleteValue(index) {
    this.studentsSet.splice(index, 1);
  }

  public addClassroom(value: any) {
    console.log('add class...');
    if (this.studentsSet.length == 0) {
      alert('Lista uczniów nie może być pusta');
      console.log('empty set');
      this.errorMessage = 'Lista uczniów nie może być pusta';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else {
      const classroomData = {
        name: value.classname,
        classLevel: value.level,
        userId: this.userId,
      };

      console.log(classroomData);
      this.addClassroomSubscription = this.studentService
        .addClass(classroomData)
        .subscribe(
          (res) => {
            console.log(res);
            this.addClassForm.reset();
            this.errorMessage = '';
            this.errorMessage = res.message;
            this.success = true;
            this.studentService
              .addStudents({
                students: this.studentsSet,
                classId: res.classId,
              })
              .subscribe();
            alert('Pomyślnie utworzono klasę');
            setTimeout(() => {
              this.router.navigate([`all-classes`]);
            }, 2000);
          },
          (error: HttpErrorResponse) => {
            alert('Błąd');
            this.errorMessage = error.error.message;
            setTimeout(() => {
              this.errorMessage = '';
            }, 3000);
          }
        );
    }
  }
}
