import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-test-mix',
  templateUrl: './test-mix.component.html',
  styleUrls: ['./test-mix.component.scss']
})
export class TestMixComponent implements OnInit {
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
      .getMixTest(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((testData) => {
        this.test = testData;
        console.log(this.test);
      });
  }


  //ABCD

  public isCorrectABCD(id: number, answer: string): void {
    this.test[id].checked = true;
    this.test[id].answer = answer;
  }

  public changeColorABCD(id: number, answer: string): string {
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

  public isCorrectTrueFalse(id: number, answer: boolean): void {
    this.test[id].checked = true;
    this.test[id].answer = answer;
  }

  public changeColorTrueFalse(id: number, answer: boolean): string {
    if (this.test[id]?.checked && this.test[id].answer === answer) {
      console.log(
        id,
        this.test[id],
        this.test[id].trueFalse,
        this.test[id].answer
      );

      if (this.test[id].trueFalse === this.test[id].answer) {
        return '#3DB86E';
      }
      return '#EC1845';
    }
    return '#BDDCFF';
  }

  public isCorrectWrite(index: number): void {
    console.log(index);
    this.test[index].checked = true;
  }

  public changeColorWrite(index: number): string {
    if (this.test[index]?.checked) {
      console.log(
        index,
        this.test[index],
        this.test[index].trueFalse,
        this.test[index].answer
      );

      if (this.test[index].second_side === this.test[index].answer) {
        return '#3DB86E';
      }
      return '#EC1845';
    }
    return '#BDDCFF';
  }
}
