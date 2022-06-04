import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-display-all-sets',
  templateUrl: './display-all-sets.component.html',
  styleUrls: ['./display-all-sets.component.scss']
})
export class DisplayAllSetsComponent implements OnInit {
  public allSets = [];

  constructor(private flashcardsService: FlashcardsService, private router: Router) { }

  ngOnInit(): void {
    this.flashcardsService.getAllSets().subscribe((response)=>{
      console.log(response);
      this.allSets = response;
    });
  }
  
  navigateToSet(id) {
    this.router.navigate([`set/${id}`]);
  }

}
