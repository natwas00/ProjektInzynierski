import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-set',
  templateUrl: './create-set.component.html',
  styleUrls: ['./create-set.component.scss']
})
export class CreateSetComponent implements OnInit {
  public flashcardsSet=[{
    left: 'przyklad',
    right: 'example'
  }];

  public errorMessage='';
  public newRow: any = {};


  constructor() { }

  ngOnInit(): void {
  }

  public addRowToSet(){
    const isRowEmpty = !this.newRow?.left || !this.newRow?.right;
    if(isRowEmpty){
     this.errorMessage='Uzupełnij obie strony fiszki!';
     setTimeout(()=>{
       this.errorMessage='';
     },3000);
    }else{
      this.flashcardsSet.push(this.newRow);
      this.errorMessage='';
      this.newRow={};
    }
  
  }

  public deleteFieldValue(index){
    this.flashcardsSet.splice(index,1);
  }

}
