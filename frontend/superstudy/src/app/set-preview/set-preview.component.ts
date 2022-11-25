import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Sides } from '../_helpers/enums';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-set-preview',
  templateUrl: './set-preview.component.html',
  styleUrls: ['./set-preview.component.scss'],
})
export class SetPreviewComponent implements OnInit, OnDestroy {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event.key);
    if (event.key === 'ArrowRight') {
      this.next();
    } else if (event.key === 'ArrowLeft') {
      this.previous();
    } else if (event.key === 'Enter') {
      this.flipCard();
    }
  }
  public id;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public set = [];
  public visibleItemId = 0;
  public visibleItemSide = Sides.firstSide;

  constructor(
    private flashcardsService: FlashcardsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getSet();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getSet(): void {
    this.flashcardsService
      .getSet(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((setData) => {
        this.set = setData;
        console.log(this.set);
      });
  }

  public flipCard(): void {
    this.visibleItemSide =
      this.visibleItemSide === Sides.firstSide
        ? Sides.secondSide
        : Sides.firstSide;
  }

  public next(): void {
    let id = this.visibleItemId + 1;
    this.visibleItemId = id >= this.set.length ? 0 : id;
  }

  public previous(): void {
    let id = this.visibleItemId - 1;
    this.visibleItemId = id < 0 ? this.set.length - 1 : id;
  }
}
