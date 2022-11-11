import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-test-writing',
  templateUrl: './test-writing.component.html',
  styleUrls: ['./test-writing.component.scss']
})
export class TestWritingComponent implements OnInit, OnDestroy {
  public id;
  public test = [];
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
    this.flashcardsService.getWritingTest(this.id).pipe(takeUntil(this.destroyed$)).subscribe((testData) => {
      this.test = testData;
      console.log(this.test);
    });
  }

  public isCorrect(index: number): void {
    console.log(index);
    this.test[index].checked = true;
  }

  public changeColor(index: number): string {
    if (this.test[index]?.checked) {
      console.log(index, this.test[index], this.test[index].trueFalse, this.test[index].answer)

      if (this.test[index].second_side === this.test[index].answer) {
        return 'green';
      }
      return 'red';
    }
    return '#BDDCFF';

  }
}
