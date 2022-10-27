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
export class SuperStudySetsService {
  constructor(private http: HttpClient) {}

  getSuperStudySets(): Observable<any> {
    return this.http.get(`${baseUrl}/api/getSuperStudySets`, httpOptions);
  }

  buySet(id: number): Observable<any> {
    return this.http.get(`${baseUrl}/api/buySuperStudySet/${id}`, httpOptions);
  }
}
