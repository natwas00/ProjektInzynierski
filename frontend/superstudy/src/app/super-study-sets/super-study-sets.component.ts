import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SuperStudySetsService } from '../_services/super-study-sets.service';
import { TokenStorageService } from '../_services/token-storage.service';

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
  public user;

  private getSetsSubscription: Subscription;
  private buySetSubscription: Subscription;

  constructor(
    private superStudyService: SuperStudySetsService,
    private token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.user = this.token.getUser();
    console.log(this.user);
    this.getSets();
  }

  getSets(): void {
    this.getSetsSubscription = this.superStudyService
      .getSuperStudySets()
      .subscribe((allSets) => {
        this.allSets = allSets;
        console.log(this.allSets);
      });
  }

  buySet(id: number): void {
    this.buySetSubscription = this.superStudyService
      .buySet(id)
      .subscribe((res) => {
        console.log(res);
        alert('Kupiono zestaw! Aby go obejrzeć przejdź do "Wszystkie zestawy"');
        this.getSets();
      });
  }
}
