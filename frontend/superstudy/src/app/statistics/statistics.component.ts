import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlashcardsService } from '../_services/flashcards.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  public numOfSets;
  public userPoints;

  public countSetSubscription: Subscription;

  constructor(
    private flashcardsService: FlashcardsService,
    private token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.countSets();
    this.userPoints = this.token.getUser();
    console.log(this.userPoints);
  }

  countSets() {
    this.countSetSubscription = this.flashcardsService
      .getAllSets()
      .subscribe((res) => {
        this.numOfSets = res.length;
      });
  }
}
