import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-class-info',
  templateUrl: './class-info.component.html',
  styleUrls: ['./class-info.component.scss'],
})
export class ClassInfoComponent implements OnInit, OnDestroy {
  public allSets = [];
  public classInfo;
  public errorMessage = '';
  public ranking = {};
  public finalRanking = [];

  private getInfoSubscription: Subscription;
  private getRankingSubscription: Subscription;

  constructor(
    private studentsService: StudentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.allSets = MOCK_SETS;

    const classId = Number(this.route.snapshot.paramMap.get('id'));

    this.getInfoSubscription = this.studentsService
      .getClassInfo(classId)
      .subscribe((classInfo) => {
        this.classInfo = classInfo;
        console.log(this.classInfo);
      });

    this.getRankingSubscription = this.studentsService
      .getRanking(classId)
      .subscribe(
        (res) => {
          this.ranking = res;
          console.log(this.ranking);
          this.getFinalRanking(this.ranking);
        },
        (error: HttpErrorResponse) => {}
      );
  }

  ngOnDestroy(): void {
    // TODO: anulowanie subskrypcji
  }

  getFinalRanking(obj) {
    let ranking = {};
    for (let key in obj) {
      let value = obj[key];
      let students = Object.keys(value);
      let points = Object.values(value);

      students.forEach((ele, i) => {
        ranking[ele] = points[i];
      });
    }
    var items = Object.keys(ranking).map((key) => {
      return [key, ranking[key]];
    });
    items.sort((first, second) => {
      return second[1] - first[1];
    });
    this.finalRanking = items;
  }
}
