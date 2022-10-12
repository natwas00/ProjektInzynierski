import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-set-menu',
  templateUrl: './set-menu.component.html',
  styleUrls: ['./set-menu.component.scss']
})
export class SetMenuComponent implements OnInit, OnDestroy {
  public id;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public setName = '';

  constructor(private flashcardsService: FlashcardsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getSetName();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getSetName(): void {
    this.flashcardsService.getSetName(this.id).pipe(takeUntil(this.destroyed$)).subscribe((name) => {
      this.setName = name.name;
    });
  }

}
