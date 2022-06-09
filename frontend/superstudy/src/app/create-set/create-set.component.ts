import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-create-set',
  templateUrl: './create-set.component.html',
  styleUrls: ['./create-set.component.scss']
})
export class CreateSetComponent implements OnInit, OnDestroy {
  @ViewChild('addSetFrom') addSetFrom;

  public flashcardsSet = [];
  public addSetSubscription;
  public errorMessage = '';
  public newRow: any = {};
  public success = false;
  public selectedFiles: FileList;
  private currentFileUpload: File;
  private addSetCSVSub;
  @ViewChild('inputFile') myInputVariable: ElementRef;


  constructor(private flashcardsService: FlashcardsService, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.addSetSubscription?.unsubscribe();
  }

  public addRowToSet() {
    const isRowEmpty = !this.newRow?.left || !this.newRow?.right;
    if (isRowEmpty) {
      this.errorMessage = 'Uzupełnij obie strony fiszki!';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else {
      this.flashcardsSet.push(this.newRow);
      this.errorMessage = '';
      this.newRow = {};
    }

  }

  public deleteFieldValue(index) {
    this.flashcardsSet.splice(index, 1);
  }

  public addSet(value: any) {
    console.log('addSet...');
    if (this.flashcardsSet.length === 0) {
      console.log('empty set')
    } else {
      let first_side = [];
      let second_side = [];
      this.flashcardsSet.forEach(flashcard => {
        first_side.push(flashcard.left);
        second_side.push(flashcard.right);
      })
      const setData = {
        name: value.title,
        level: value.level,
        subject: value.subject,
        first_side,
        second_side
      };
      console.log(setData);
      this.addSetSubscription = this.flashcardsService.addSet(setData).subscribe(
        (res) => {
          console.log(res);
          this.flashcardsSet = [];
          this.addSetFrom.reset();
          this.errorMessage = '';
          this.newRow = {};
          this.errorMessage = res.message;
          this.success = true;
          setTimeout(() => {
            this.router.navigate([`all-sets`]);
          },2000);
        },
        (error: HttpErrorResponse) => {
          console.error(error)
          this.errorMessage = error.error.message;
        })
    }
  }

  public setFile(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
  }

  public sendFile() {
    const formdata: FormData = new FormData();
    formdata.append('file', this.currentFileUpload);
    console.log(formdata.get('file'));
    this.addSetCSVSub = this.flashcardsService.addSetCSV( formdata ).subscribe((res) => {
      if(res[0].first_side && res[0].second_side){
        const flashcardsFromCsv = res.map((elem)=>{
          return { left: elem.first_side, right: elem.second_side };
        });
        this.flashcardsSet = flashcardsFromCsv;
      }
      console.log(res);
    }, (e)=>{
      console.error(e);
      this.addSetCSVSub?.unsubscribe();
    }, ()=>{
      this.addSetCSVSub?.unsubscribe();
    });
    console.log(this.selectedFiles);
  }

  public removeCSV() {
    this.myInputVariable.nativeElement.value = "";
    this.selectedFiles = null;
  }
}
