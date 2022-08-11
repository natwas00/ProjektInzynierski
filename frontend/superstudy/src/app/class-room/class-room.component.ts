import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';

const MOCK_SETS: any[] = [
  {
    id: '1',
    name: 'Dom',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '2',
    name: 'Zdrowie',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '3',
    name: 'Jedzenie',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '4',
    name: 'Dom',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '5',
    name: 'Zdrowie',
    subject: 'Angielski',
    level: 'klasa 4',
  },
  {
    id: '6',
    name: 'Jedzenie',
    subject: 'Angielski',
    level: 'klasa 4',
  },
];

@Component({
  selector: 'app-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss']
})
export class ClassRoomComponent implements OnInit, OnDestroy {
  public allSets = [];
  public level;
  public isTeacherRole = true;

  ngOnInit(): void {
    this.allSets = MOCK_SETS;
    this.level = 'Klasa 5C angielski';
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

  // public allSets = [];
  // public getAllSetsSubscription;
  //
  // constructor(private flashcardsService: FlashcardsService, private router: Router) { }
  //
  // ngOnInit(): void {
  //   this.getAllSetsSubscription = this.flashcardsService.getAllSets().subscribe((response)=>{
  //     console.log(response);
  //     this.allSets = response;
  //   });
  // }
  //
  // ngOnDestroy(): void {
  //   this.getAllSetsSubscription?.unsubscribe();
  // }
  //
  // navigateToSet(id) {
  //   this.router.navigate([`set/${id}`]);
  // }
}
