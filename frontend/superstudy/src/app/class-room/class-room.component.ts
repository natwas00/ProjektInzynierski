import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentsService } from '../_services/students.service';
import { Router } from '@angular/router';

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
  public isTeacherRole = true;
  public classInfo;

  private getInfoSubscription: Subscription;
  private getAllSetsSubscription: Subscription;

  constructor(
    private studentsService: StudentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //this.allSets = MOCK_SETS;
    const classId = Number(this.route.snapshot.paramMap.get('id'));

    this.getInfoSubscription = this.studentsService
      .getClassInfo(classId)
      .subscribe((classInfo) => {
        this.classInfo = classInfo;
        console.log(this.classInfo);
      });

    this.getAllSetsSubscription = this.studentsService
      .getAllClassSets(classId)
      .subscribe((allSets) => {
        this.allSets = allSets;
        console.log('all sets');
      });
  }

  ngOnDestroy(): void {
    // TODO: anulowanie subskrypcji
  }

  navigateToSet(id) {
    this.router.navigate([`set/${id}`]);
  }
}
