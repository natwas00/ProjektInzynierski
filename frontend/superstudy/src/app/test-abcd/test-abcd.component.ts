import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-test-abcd',
  templateUrl: './test-abcd.component.html',
  styleUrls: ['./test-abcd.component.scss'],
})
export class TestAbcdComponent implements OnInit, OnDestroy {
  public id;
  public test = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private flashcardsService: FlashcardsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getTest();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getTest(): void {
    this.flashcardsService
      .getAbcdTest(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((testData) => {
        this.test = testData;
        console.log(this.test);
      });
  }

  public isCorrect(id: number, answer: string): void {
    this.test[id].checked = true;
    this.test[id].answer = answer;
  }

  public changeColor(id: number, answer: string): string {
    if (this.test[id]?.checked && this.test[id].answer === answer) {
      console.log(
        id,
        this.test[id],
        this.test[id].trueFalse,
        this.test[id].answer
      );

      if (this.test[id].second_side === this.test[id].answer) {
        return '#3DB86E'; //green
      }
      return '#EC1845'; //red
    }
    if (this.test[id]?.checked && this.test[id].second_side === answer) {
      return '#3DB86E'; //green
    }
    return '#BDDCFF';
  }
}
