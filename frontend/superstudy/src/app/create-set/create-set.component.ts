import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlascardsService } from '../_services/flascards.service';

@Component({
  selector: 'app-create-set',
  templateUrl: './create-set.component.html',
  styleUrls: ['./create-set.component.scss']
})
export class CreateSetComponent implements OnInit {
  public flashcardsSet = [{
    left: 'przyklad',
    right: 'example'
  }];

  public errorMessage = '';
  public newRow: any = {};


  constructor(private flascardsService: FlascardsService) { }

  ngOnInit(): void {
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
    if (this.flashcardsSet.length === 0) {
      console.log('empty set')
    } else {
      let first_side = [];
      let second_side = [];
      this.flashcardsSet.forEach(flascard=>{
        first_side.push(flascard.left);
        second_side.push(flascard.right);
      })
      const setData = {
        name: value.title,
        level: value.level,
        subject: value.subject,
        first_side,
        second_side
      };
      console.log(setData);
      this.flascardsService.addSet(setData).subscribe(
        (res) => {
          console.log(res);
          this.flashcardsSet = [{
            left: 'przyklad',
            right: 'example'
          }];

          this.errorMessage = '';
          this.newRow = {};
          this.errorMessage = res.message;
        },
        (error: HttpErrorResponse) => {
          console.error(error)
          this.errorMessage = error.error.message;
        })
    }
  }
}
