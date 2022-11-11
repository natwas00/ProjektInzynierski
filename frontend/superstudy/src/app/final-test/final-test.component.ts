import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-test-writing',
  templateUrl: './final-test.component.html',
  styleUrls: ['./final-test.component.scss']
})
export class FinalTestComponent implements OnInit, OnDestroy {
  public id;
  public test = [];
  public finished = false;
  public result;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private flashcardsService: FlashcardsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getTest();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getTest(): void {
    this.flashcardsService.getFinalTest(this.id).pipe(takeUntil(this.destroyed$)).subscribe((testData) => {
      this.test = testData;
      console.log(this.test);
    });
  }

  public changeColor(index: number): string {
    if (this.finished) {
      if (this.test[index].second_side === this.test[index].answer) {
        return 'green';
      }
      return 'red';
    }
    return '#BDDCFF';

  }

  public async sendAnswers(): Promise<void> {
    const answers = this.test.map(item => {
      return {
        first_side: item.first_side,
        second_side: item.second_side,
        id: item.id,
        answer: item.answer ?? '',
      };
    });

    const answerSub = this.flashcardsService.sendFinalTestAnswer(this.id, answers).pipe(takeUntil(this.destroyed$)).subscribe(response => {
      console.log(response);
      this.finished = true;
      this.result = response;
      answerSub.unsubscribe();
    });
  }
}
