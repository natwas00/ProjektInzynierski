import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://superstudy.projektstudencki.pl:8080';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private http: HttpClient) {}

  getClassesList(): Observable<any> {
    return this.http.get(`${baseUrl}/api/classes`, httpOptions);
  }

  getStudentsList(classId: number): Observable<any> {
    return this.http.post(
      `${baseUrl}/api/get/studentsFromClass`,
      {
        classId,
      },
      httpOptions
    );
  }

  addClass(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/create/class`, data, httpOptions);
  }

  addStudents(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/add/student`, data, httpOptions);
  }

  deleteClass(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/api/delete_class/${id}`, httpOptions);
  }

  getClassInfo(id: number): Observable<any> {
    return this.http.get(`${baseUrl}/api/class_info/${id}`, httpOptions);
  }

  getAllClassSets(id: number): Observable<any> {
    return this.http.get(`${baseUrl}/api/class_sets/${id}`, httpOptions);
  }
}
