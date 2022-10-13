import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../_services/students.service';
import { Subscription } from 'rxjs';
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

  private getAllStudentsSubscription: Subscription;
  private getInfoSubscription: Subscription;

  constructor(
    private studentsService: StudentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.allSets = MOCK_SETS;

    const classId = Number(this.route.snapshot.paramMap.get('id'));

    this.getAllStudentsSubscription = this.studentsService
      .getStudentsList(classId)
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

    // this.getInfoSubscription = this.studentsService
    //   .getClassInfo(classId)
    //   .subscribe((classInfo) => {
    //     this.classInfo = classInfo;
    //     console.log(this.classInfo);
    //   });
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
}
