import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements OnInit, OnDestroy {
  private id;
  previews: string[] = [];
  private addSetCSVSub;
  public set = [];
  public editset = true
  public success = false;
  public addFlashcardMode = false;
  public error_mess = "";
  public error_mess_edit = ""
  public enableCSV = false;
  public displayRemoveModal = false;
  public newFlashcard = {
    first_side: [''],
    second_side: ['']
  };
  public selectedFiles: FileList;
  private currentFileUpload: File;
  public getSetSubscription;
  public deleteSetSubscription;
  public editFlashcardSubscription;
  public deleteFlashcardSubscription;
  public addNewFlashcardSubscription;
  public getSetnameSubscription;
  public addImageSubscription;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  @ViewChild('fileInput') myInputVariable2: ElementRef;

  public setDetails = {
    name: 'Przykladowa nazwa'
  };

  constructor(private flashcardsService: FlashcardsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getSet();
    // this.route.data.subscribe((data:Data) =>{
    //   this.editset = data['message'];
    // })
  }

  public getSet(): void {
    this.getSetnameSubscription = this.flashcardsService.getSetName(this.id).subscribe((name) => {
      this.setDetails.name = name.name;
      this.getSetnameSubscription?.unsubscribe();
    });
    this.getSetSubscription = this.flashcardsService.getSet(this.id).subscribe((d) => {
      console.log(d);
      this.set = d;
      this.getSetSubscription?.unsubscribe();
    });
    console.log(this.id);
  }
  enableCsv(): void {
    this.enableCSV = !this.enableCSV
  }
  ngOnDestroy(): void {
    console.log('destroy');
    this.deleteSetSubscription?.unsubscribe();
    this.getSetSubscription?.unsubscribe();
    this.editFlashcardSubscription?.unsubscribe();
    this.deleteFlashcardSubscription?.unsubscribe();
    this.addNewFlashcardSubscription?.unsubscribe();
    this.getSetnameSubscription?.unsubscribe();
    this.addImageSubscription?.unsubscribe();
  }

  public deleteSet() {
    this.deleteSetSubscription = this.flashcardsService.deleteSet(this.id).subscribe((d) => {
      console.log(d);
      this.displayRemoveModal = false;
      this.success = true;
      setTimeout(() => {
        this.router.navigate([`all-sets`]);
      }, 2000);
    });
  }

  public enableEditFlashcard(index) {
    this.set[index].editMode = true;
    this.set[index].error_mess = "";
  }

  public confirmEdit(index, id) {
    if (this.set[index].file) {
      this.addImageSubscription = this.flashcardsService.addImage(this.set[index].file, id).subscribe((d) => {
        console.log(d);
        this.addImageSubscription?.unsubscribe();
      }, (error) => {
        // console.error(error);
      });
    }
    const requestBody = {
      first_side: this.set[index].first_side,
      second_side: this.set[index].second_side
    };
    this.editFlashcardSubscription = this.flashcardsService.editFlashcard(requestBody, id).subscribe((d) => {
      console.log(index, id);
      console.log(d);
      this.set[index].editMode = false;
      this.set[index].error_mess = ""
    }, (error) => {
      console.error(error);
      this.set[index].error_mess = error.error
    }, () => {
      this.getSet();
      this.addImageSubscription?.unsubscribe();
    })

  }

  public deleteFlashcard(id) {
    this.deleteFlashcardSubscription = this.flashcardsService.deleteFlashcard(id).subscribe((d) => {
      console.log(id);
      console.log(d);
      this.getSet();
    }, (error) => {
      console.error(error);
    })

  }
  public edit_set() {
    this.editset = !this.editset
  }
  public enableAddFlashcardMode() {
    this.addFlashcardMode = true;
  }

  public confirmAddNewFlashcard() {
    console.log(this.newFlashcard, this.id);
    this.addNewFlashcardSubscription = this.flashcardsService.addNewFlashcard(this.newFlashcard, this.id).subscribe((d) => {
      console.log(d);
      if (this.set[0].file) {
        this.addImageSubscription = this.flashcardsService.addImage(this.set[0].file, d.id).subscribe((d) => {
          console.log(d);
       
          
        }, (error) => {
        });
        this.previews = []
        setTimeout(() => {
         this.getSet();
       }, 1000);
       this.myInputVariable2.nativeElement.value = "";
      }

      this.getSet();
      this.newFlashcard = {
        first_side: [''],
        second_side: ['']
      };
      this.error_mess = ""
    }, (error) => {
      console.error(error);
      this.error_mess = error.error
    })
  }

  public cancelAddNewFlashcard() {
    this.addFlashcardMode = false;
    this.previews = []

  }
  public setFile(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
  }
  public sendFile() {
    const formdata: FormData = new FormData();
    formdata.append('file', this.currentFileUpload);
    console.log(formdata.get('file'));
    this.addSetCSVSub = this.flashcardsService.sendCSV(formdata, this.id).subscribe((res) => {

      setTimeout(() => {
        this.getSet();
      }, 100);
      console.log(res);
    }, (e) => {
      console.error(e);
      this.addSetCSVSub?.unsubscribe();
    }, () => {
      this.addSetCSVSub?.unsubscribe();
    });
    console.log(this.selectedFiles);
    this.getSet()
    this.removeCSV()
  }

  public removeCSV() {
    this.myInputVariable.nativeElement.value = "";
    this.selectedFiles = null;
  }

  public openRemoveModal() {
    this.displayRemoveModal = true;
  }

  public closeRemoveModal() {
    this.displayRemoveModal = false;
  }

  public setImage(event: any, index: number): void {
    const currentFileUpload = event.target.files.item(0);
    const formdata: FormData = new FormData();
    formdata.append('file', currentFileUpload, currentFileUpload.name);
      
       if (index == null){
          const reader = new FileReader();

          reader.onload = (e: any) => {
            console.log(e.target.result);
            this.previews = []
            this.previews.push(e.target.result);
          
          };

          reader.readAsDataURL(currentFileUpload);
          this.set[0].file = formdata;

    }
    else {
      this.set[index].file = formdata;
      console.log(this.set[index].file);
    }
    

  }

}
