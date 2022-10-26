import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SuperStudySetsService } from '../_services/super-study-sets.service';

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
  selector: 'app-super-study-sets',
  templateUrl: './super-study-sets.component.html',
  styleUrls: ['./super-study-sets.component.scss'],
})
export class SuperStudySetsComponent implements OnInit {
  public allSets = [];

  private getSetsSubscription: Subscription;

  constructor(private superStudyService: SuperStudySetsService) {}

  ngOnInit(): void {
    //this.allSets = MOCK_SETS;
    this.getSetsSubscription = this.superStudyService
      .getSuperStudySets()
      .subscribe((allSets) => {
        this.allSets = allSets;
        console.log(this.allSets);
      });
  }

  getSets() {}
}
