import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-test-true-false',
  templateUrl: './test-true-false.component.html',
  styleUrls: ['./test-true-false.component.scss']
})
export class TestTrueFalseComponent implements OnInit, OnDestroy {
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
    this.flashcardsService.getTrueFalseTest(this.id).pipe(takeUntil(this.destroyed$)).subscribe((testData) => {
      this.test = testData;
      console.log(this.test);
    });
  }

  public isCorrect(id:number, answer:boolean): void {
    this.test[id].checked = true;
    this.test[id].answer = answer;
  }

  public changeColor(id:number, answer: boolean): string {
    if(this.test[id]?.checked && this.test[id].answer===answer){
      console.log(id, this.test[id], this.test[id].trueFalse, this.test[id].answer)

      if(this.test[id].trueFalse===this.test[id].answer){
        return 'green';
      }
      return 'red';
    }
    return '#BDDCFF';
  }

}
