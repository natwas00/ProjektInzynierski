import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../_services/students.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  public allClasses = [];
  public getAllClassesSubscription;
  public classId;
  public createTaskSubscription;
  public task = '';
  public date = '';

  constructor(
    private studentsService: StudentsService,
    private router: Router
  ) {}

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

  public createTask() {
    this.date = this.date.split('-').join('/');
    const taskData = {
      classId: this.classId,
      task: this.task,
      finishDate: this.date,
    };
    console.log(taskData);
    this.createTaskSubscription = this.studentsService
      .createTask(taskData)
      .subscribe((res) => {
        console.log(res);
        alert('Pomyślnie dodano zadanie domowe');
        setTimeout(() => {
          this.router.navigate([`class-room/${this.classId}`]);
        });
      });
  }
}
