import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentsService } from '../_services/students.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenStorageService } from '../_services/token-storage.service';

const MOCK_SETS: any[] = [
  {
    id: '1',
    name: 'Nazwa klasy 1',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '2',
    name: 'Nazwa klasy 2',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '3',
    name: 'Nazwa klasy 3',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '4',
    name: 'Nazwa klasy 4',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '5',
    name: 'Nazwa klasy 5',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '6',
    name: 'Nazwa klasy 6',
    subject: 'Angielski',
    level: 'klasa 4',
  },
];

@Component({
  selector: 'app-all-classes',
  templateUrl: './all-classes.component.html',
  styleUrls: ['./all-classes.component.scss'],
})
export class AllClassesComponent implements OnInit, OnDestroy {
  public allSets = [];
  public isTeacherRole;
  public displayRemoveModal = false;
  public success = false;
  public errorMessage = '';
  public classToDelete;
  public user;

  private getAllClassesSubscription: Subscription;
  private deleteClassSubscription: Subscription;
  private getAllClassesStudentSubscription: Subscription;

  constructor(
    private router: Router,
    private studentsService: StudentsService,
    private token: TokenStorageService
  ) {}

  ngOnInit(): void {
    //this.allSets = MOCK_SETS;
    this.user = this.token.getUser();
    console.log(this.user);
    if (this.user.roles.includes('ROLE_TEACHER')) {
      this.isTeacherRole = true;
      this.getAllClasses();
    } else {
      this.getAllClassesStudent();
    }
  }

  ngOnDestroy(): void {
    // TODO: anulowanie subskrypcji
  }

  getAllClasses(): void {
    this.getAllClassesSubscription = this.studentsService
      .getClassesList()
      .subscribe((allSets) => {
        this.allSets = allSets;
        console.log(this.allSets);
      });
  }
  getAllClassesStudent(): void {
    this.getAllClassesStudentSubscription = this.studentsService
      .getStudentClasses()
      .subscribe((allSets) => {
        this.allSets = allSets;
        console.log(this.allSets);
      });
  }

  moveToEdit(classId: number): void {
    this.router.navigate([`/edit-class/${classId}`]);
  }

  moveToClass(classId: number): void {
    this.router.navigate([`class-room/${classId}`]);
  }

  moveToInfo(classId: number): void {
    this.router.navigate([`class-info/${classId}`]);
  }

  public deleteClass(): void {
    console.log('delete...');
    this.deleteClassSubscription = this.studentsService
      .deleteClass(this.classToDelete)
      .subscribe(
        (d) => {
          console.log(d);
          this.displayRemoveModal = false;
          this.success = true;
          this.getAllClasses();
          this.classToDelete = null;
        },
        (error: HttpErrorResponse) => {
          alert('Pomyślnie usunięto klasę');
          this.errorMessage = error.error.message;
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      );
  }

  public openRemoveModal(classId: number) {
    this.displayRemoveModal = true;
    this.classToDelete = classId;
  }

  public closeRemoveModal() {
    this.displayRemoveModal = false;
  }
}
