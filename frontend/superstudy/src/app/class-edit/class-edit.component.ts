import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';

const MOCK_SETS: any[] = [
  {
    id: '1',
    name: 'Kasia',
    stars: 120,
  },
  {
    id: '2',
    name: 'Maciek',
    stars: 117,
  },
  {
    id: '3',
    name: 'Jakub',
    stars: 120,
  },
  {
    id: '4',
    name: 'Patryk',
    stars: 117,
  },
  {
    id: '5',
    name: 'Patryk',
    stars: 117,
  },
];

@Component({
  selector: 'app-class-edit',
  templateUrl: './class-edit.component.html',
  styleUrls: ['./class-edit.component.scss'],
})
export class ClassEditComponent implements OnInit, OnDestroy {
  public allSets = [];
  constructor() {}

  ngOnInit(): void {
    this.allSets = MOCK_SETS;
  }

  ngOnDestroy(): void {
    // TODO: anulowanie subskrypcji
  }
}
