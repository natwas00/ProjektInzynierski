import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-display-all-sets',
  templateUrl: './display-all-sets.component.html',
  styleUrls: ['./display-all-sets.component.scss']
})
export class DisplayAllSetsComponent implements OnInit, OnDestroy {
  public allSets = [];
  public getAllSetsSubscription;

  constructor(private flashcardsService: FlashcardsService, private router: Router) { }

  ngOnInit(): void {
    this.getAllSetsSubscription = this.flashcardsService.getAllSets().subscribe((response)=>{
      console.log(response);
      this.allSets = response;
    });
  }

  ngOnDestroy(): void {
    this.getAllSetsSubscription?.unsubscribe();
  }
  
  navigateToSet(id) {
    this.router.navigate([`set/${id}`]);
  }

}
