import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements OnInit {
  private id;

  constructor(private flashcardsService: FlashcardsService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.flashcardsService.getSet(this.id).subscribe((d)=>{
      console.log(d);
    });
    console.log(this.id);
  }

}
