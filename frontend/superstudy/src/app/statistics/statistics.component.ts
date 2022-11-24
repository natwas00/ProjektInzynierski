import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlashcardsService } from '../_services/flashcards.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { StudentsService } from '../_services/students.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  public numOfSets;
  public userPoints;
  public user;
  public correctAnswers;

  public countSetSubscription: Subscription;
  public getCorrectSubscription: Subscription;

  constructor(
    private flashcardsService: FlashcardsService,
    private token: TokenStorageService,
    private studentsService: StudentsService
  ) {}

  ngOnInit(): void {
    this.countSets();
    this.getCorrectAnswers();
    this.user = this.token.getUser();
    this.userPoints = this.user.points;
  }

  countSets() {
    this.countSetSubscription = this.flashcardsService
      .getAllSets()
      .subscribe((res) => {
        this.numOfSets = res.totalItems;
      });
  }

  getCorrectAnswers() {
    this.getCorrectSubscription = this.studentsService
      .getStatistics()
      .subscribe((res) => {
        this.correctAnswers = res.percent;
        console.log(this.correctAnswers);
      });
  }
}
