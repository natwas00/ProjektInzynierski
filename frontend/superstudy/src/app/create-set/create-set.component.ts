import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';
import { StudentsService } from '../_services/students.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-set',
  templateUrl: './create-set.component.html',
  styleUrls: ['./create-set.component.scss'],
})
export class CreateSetComponent implements OnInit, OnDestroy {
  @ViewChild('addSetFrom') addSetFrom;

  public flashcardsSet = [];
  public addSetSubscription;
  public getAllClassesSubscription;
  public errorMessage = '';
  public newRow: any = {};
  public success = false;
  public selectedFiles: FileList;
  private currentFileUpload: File;
  private addSetCSVSub;
  public user;
  private classId;
  private allClasses;
  public csvname = 'Wybierz plik csv';
  @ViewChild('inputFile') myInputVariable: ElementRef;

  constructor(
    private flashcardsService: FlashcardsService,
    private router: Router,
    private token: TokenStorageService,
    private route: ActivatedRoute,
    private studentsService: StudentsService
  ) {}

  ngOnInit(): void {
    this.user = this.token.getUser();
    this.user = this.user.roles;
    console.log(this.user);
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.getAllClasses();
  }

  ngOnDestroy(): void {
    this.addSetSubscription?.unsubscribe();
  }

  public addRowToSet() {
    const isRowEmpty = !this.newRow?.left || !this.newRow?.right;
    if (isRowEmpty) {
      alert('Uzupełnij obie strony fiszki!');
      this.errorMessage = 'Uzupełnij obie strony fiszki!';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else if (
      this.flashcardsSet.find(
        (element) =>
          element.left == this.newRow.left && element.right == this.newRow.right
      )
    ) {
      alert('Dodano już taką fiszkę');
      this.errorMessage = 'Dodano już taką fiszkę';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      this.newRow = {};
    } else {
      this.flashcardsSet.unshift(this.newRow);
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
      alert('Zestaw nie może być pusty');

      console.log('empty set');
      this.errorMessage = 'Zestaw nie może być pusty';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else {
      let first_side = [];
      let second_side = [];
      this.flashcardsSet.forEach((flashcard) => {
        first_side.push(flashcard.left);
        second_side.push(flashcard.right);
      });
      const setData = {
        name: value.title,
        level: value.level,
        subject: value.subject,
        first_side,
        second_side,
        ...(this.user.includes('ROLE_TEACHER') && { classId: this.classId }),
      };
      console.log(setData);
      this.addSetSubscription = this.flashcardsService
        .addSet(setData)
        .subscribe(
          (res) => {
            console.log(res);
            this.flashcardsSet = [];
            this.addSetFrom.reset();
            this.errorMessage = '';
            this.newRow = {};
            this.errorMessage = res.message;
            alert(res.message);
            this.success = true;
            if (this.user.includes('ROLE_TEACHER')) {
              setTimeout(() => {
                this.router.navigate([`all-classes`]);
              }, 2000);
            } else {
              setTimeout(() => {
                this.router.navigate([`all-sets`]);
              }, 2000);
            }
          },
          (error: HttpErrorResponse) => {
            alert('Błąd');
            this.errorMessage = error.error.message;
            setTimeout(() => {
              this.errorMessage = '';
            }, 3000);
          }
        );
    }
  }

  public setFile(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.csvname = this.selectedFiles[0].name;
  }

  public sendFile() {
    const formdata: FormData = new FormData();
    formdata.append('file', this.currentFileUpload);
    console.log(formdata.get('file'));
    this.addSetCSVSub = this.flashcardsService.addSetCSV(formdata).subscribe(
      (res) => {
        if (res[0].first_side && res[0].second_side) {
          const flashcardsFromCsv = res.map((elem) => {
            return { left: elem.first_side, right: elem.second_side };
          });
          this.flashcardsSet = flashcardsFromCsv;
        }
        console.log(res);
      },
      (e) => {
        console.error(e);
        this.addSetCSVSub?.unsubscribe();
      },
      () => {
        this.addSetCSVSub?.unsubscribe();
      }
    );
    console.log(this.selectedFiles);
  }

  public removeCSV() {
    this.myInputVariable.nativeElement.value = '';
    this.selectedFiles = null;
    this.csvname = 'Wybierz plik csv';
  }

  public getAllClasses() {
    this.getAllClassesSubscription = this.studentsService
      .getClassesList()
      .subscribe((allClasses) => {
        this.allClasses = allClasses;
        console.log(this.allClasses);
      });
  }

  public getClassId(id: number) {
    console.log(id);
    this.classId = id;
  }
}
