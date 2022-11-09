import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../_services/students.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  public allClasses = [];
  public getAllClassesSubscription;
  public classId;

  constructor(private studentsService: StudentsService) {}

  ngOnInit(): void {
    this.getAllClasses();
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
