import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://superstudy.projektstudencki.pl:8080/api';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class FlascardsService {

  constructor(private http: HttpClient) { }

  addSet(data: any): Observable<any> {
    return this.http.post(baseUrl + "/add_set", data, httpOptions);
  }
}
