import { Injectable } from '@angular/core';
import { Person } from '../models/person.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  backendUrl = 'https://peoplehub-backend.onrender.com';
  // backendUrl = 'http://localhost:3000';

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.backendUrl}/person`);
  }

  getPerson(id: string): Observable<Person | undefined> {
    return this.http.get<Person>(`${this.backendUrl}/person/${id}`);
  }

  addPerson(person: Person): Observable<Person> {
    console.log(person);
    return this.http.post<Person>(`${this.backendUrl}/person`, person);
  }

  updatePerson(id: string, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.backendUrl}/person/${id}`, person);
  }

  deletePerson(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.backendUrl}/person/${id}`);
  }
}
