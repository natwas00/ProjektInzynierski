import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Change_pass } from '../models/change_passs.model';
const baseUrl = 'http://localhost:8080/api';
@Injectable({
    providedIn: 'root'
  })
export class DataService{
    constructor(private http: HttpClient) { }
    update(data: any): Observable<any> {
        return this.http.put(baseUrl+ "/test/update", data);
      }
      delete(): Observable<any> {
        return this.http.delete(baseUrl+"/test/delete");
      }
}