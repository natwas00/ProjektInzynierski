import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';

const MOCK_SETS: any[] = [
  {
    id: '1',
    name: 'Nazwa klasy 1',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '2',
    name: 'Nazwa klasy 2',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '3',
    name: 'Nazwa klasy 3',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '4',
    name: 'Nazwa klasy 4',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '5',
    name: 'Nazwa klasy 5',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '6',
    name: 'Nazwa klasy 6',
    subject: 'Angielski',
    level: 'klasa 4',
  },
];

@Component({
  selector: 'app-all-classes',
  templateUrl: './all-classes.component.html',
  styleUrls: ['./all-classes.component.scss']
})
export class AllClassesComponent implements OnInit, OnDestroy {
  public allSets = [];
  public isTeacherRole = true;

  ngOnInit(): void {
    this.allSets = MOCK_SETS;
  }

  ngOnDestroy(): void {
    // TODO: anulowanie subskrypcji
  }

  addNewSet(): void {
    console.log('addNewSet...');
  }

  stats(): void {
    console.log('stats...');
  }
}
