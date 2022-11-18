import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentsService } from '../_services/students.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TokenStorageService } from '../_services/token-storage.service';
import { HttpErrorResponse } from '@angular/common/http';

const MOCK_SETS: any[] = [
  {
    id: '1',
    name: 'Dom',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '2',
    name: 'Zdrowie',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '3',
    name: 'Jedzenie',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '4',
    name: 'Dom',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '5',
    name: 'Zdrowie',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '6',
    name: 'Jedzenie',
    subject: 'Angielski',
    level: 'klasa 4',
  },
];

@Component({
  selector: 'app-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss'],
})
export class ClassRoomComponent implements OnInit, OnDestroy {
  public allSets = [];
  public isTeacherRole = false;
  public classInfo;
  public tasks = [];
  public classId;
  public user;
  public errorMessage = '';

  private getInfoSubscription: Subscription;
  private getAllSetsSubscription: Subscription;
  private getTasksSubscription: Subscription;
  private deleteTaskSubscription: Subscription;

  constructor(
    private studentsService: StudentsService,
    private route: ActivatedRoute,
    private router: Router,
    private token: TokenStorageService
  ) {}

  ngOnInit(): void {
    //this.allSets = MOCK_SETS;
    const classId = Number(this.route.snapshot.paramMap.get('id'));
    this.classId = classId;

    this.user = this.token.getUser();
    if (this.user.roles.includes('ROLE_TEACHER')) {
      this.isTeacherRole = true;
    }

    this.getInfo();
    this.getSets();
    this.getTasks();
  }

  ngOnDestroy(): void {
    // TODO: anulowanie subskrypcji
  }

  navigateToSet(id) {
    this.router.navigate([`set-menu/${id}`]);
  }

  getInfo(): void {
    this.getInfoSubscription = this.studentsService
      .getClassInfo(this.classId)
      .subscribe((classInfo) => {
        this.classInfo = classInfo;
        console.log(this.classInfo);
      });
  }

  getSets(): void {
    this.getAllSetsSubscription = this.studentsService
      .getAllClassSets(this.classId)
      .subscribe((allSets) => {
        this.allSets = allSets;
        console.log('all sets');
        console.log(this.allSets);
      });
  }

  getTasks(): void {
    this.getTasksSubscription = this.studentsService
      .getTask(this.classId)
      .subscribe((res) => {
        this.tasks = res;
        console.log(this.tasks);
      });
  }

  formatDate(date) {
    const datepipe: DatePipe = new DatePipe('en-US');
    let formattedDate = datepipe.transform(date, 'd-M-y');
    return formattedDate;
  }

  deleteTask(id) {
    this.deleteTaskSubscription = this.studentsService.deleteTask(id).subscribe(
      (res) => {
        console.log(res);
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = error.error.message;
        alert('Pomyślnie usunięto zadanie domowe');
        this.getInfo();
        this.getSets();
        this.getTasks();
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    );
  }
}
