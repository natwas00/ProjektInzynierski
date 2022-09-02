import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../_services/students.service';
import { Subscription } from 'rxjs';

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

  private getAllSetsSubscription: Subscription;

  constructor(
    private studentsService: StudentsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.allSets = MOCK_SETS;

    const setId = Number(this.route.snapshot.paramMap.get('id'));

    this.getAllSetsSubscription = this.studentsService.getStudentsList(setId)
      .subscribe((studentsList) => {
        this.studentsList = studentsList;
      });
  }

  ngOnDestroy(): void {
    this.getAllSetsSubscription?.unsubscribe();
  }

  public toogleEditModeGeneralInfo(): void {
    this.editModeGeneralInfo = !this.editModeGeneralInfo;
  }

  public toogleEditModeStudentsList(): void {
    this.editModeStudentsList = !this.editModeStudentsList;
  }
}
