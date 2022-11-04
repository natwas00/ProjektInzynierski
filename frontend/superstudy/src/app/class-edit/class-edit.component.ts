import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../_services/students.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

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
  selector: 'app-class-edit',
  templateUrl: './class-edit.component.html',
  styleUrls: ['./class-edit.component.scss'],
})
export class ClassEditComponent implements OnInit, OnDestroy {
  public allSets = [];
  public editModeGeneralInfo = false;
  public editModeStudentsList = false;

  public studentsList: any[] = [];
  public classInfo;
  public errorMessage = '';
  public classId;
  public editClassName;
  public editClassLevel;
  public studentToAdd;

  private getAllStudentsSubscription: Subscription;
  private getInfoSubscription: Subscription;
  private editGeneralInfoSubscription: Subscription;
  private deleteStudentSubscription: Subscription;
  private addStudentSubscription: Subscription;

  constructor(
    private studentsService: StudentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.allSets = MOCK_SETS;

    const classId = Number(this.route.snapshot.paramMap.get('id'));
    this.classId = classId;

    this.getStudentsList();

    this.getGeneralInfo();
  }

  ngOnDestroy(): void {
    this.getAllStudentsSubscription?.unsubscribe();
  }

  public toogleEditModeGeneralInfo(): void {
    this.editModeGeneralInfo = !this.editModeGeneralInfo;
  }

  public toogleEditModeStudentsList(): void {
    this.editModeStudentsList = !this.editModeStudentsList;
  }

  public getStudentsList(): void {
    this.getAllStudentsSubscription = this.studentsService
      .getStudentsList(this.classId)
      .subscribe(
        (studentsList) => {
          this.studentsList = studentsList;
          console.log(this.studentsList);
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = error.error.message;
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      );
  }

  public getGeneralInfo(): void {
    this.getInfoSubscription = this.studentsService
      .getClassInfo(this.classId)
      .subscribe((classInfo) => {
        this.classInfo = classInfo;
        console.log(this.classInfo);
        this.editClassName = this.classInfo.name;
        this.editClassLevel = this.classInfo.level;
      });
  }

  public editGeneralInfo(value: any) {
    const requestBody = {
      name: this.editClassName,
      class_level: this.editClassLevel,
    };
    console.log(requestBody);
    this.editGeneralInfoSubscription = this.studentsService
      .editClassInfo(requestBody, this.classId)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error: HttpErrorResponse) => {
          alert('Pomyślnie zedytowano klasę');
          //dać do res
          this.toogleEditModeGeneralInfo();
          this.getInfoSubscription = this.studentsService
            .getClassInfo(this.classId)
            .subscribe((classInfo) => {
              this.classInfo = classInfo;
              console.log(this.classInfo);
            });
          //
          this.errorMessage = error.error.message;
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      );
  }

  public deleteStudent(id: number) {
    this.deleteStudentSubscription = this.studentsService
      .deleteStudent(id, this.classId)
      .subscribe(
        (res) => {
          console.log(res);
          alert('Pomyślnie usunięto ucznia');
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = error.error.message;
          this.getStudentsList();
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      );
  }

  public addStudent() {
    const students: any[] = [];
    students.push(this.studentToAdd);
    this.addStudentSubscription = this.studentsService
      .addStudents({
        students: students,
        classId: this.classId,
      })
      .subscribe(
        (res) => {
          console.log(res);
          this.studentToAdd = '';
          alert('Pomyślnie dodano nowego ucznia');
          this.getStudentsList();
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = error.error.message;
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      );
  }
}
