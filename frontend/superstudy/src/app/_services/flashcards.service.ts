import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://superstudy.projektstudencki.pl:8080';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class FlashcardsService {

  constructor(private http: HttpClient) { }

  addSet(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/add_set`, data, httpOptions);
  }

  getAllSets(): Observable<any> {
    return this.http.get(`${baseUrl}/api/sets`, httpOptions);
  }

  getSet(id: number): Observable<any> {
    return this.http.get(`${baseUrl}/set/${id}`, httpOptions);
  }
}
