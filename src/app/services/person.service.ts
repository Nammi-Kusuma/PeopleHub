import { Injectable } from '@angular/core';
import { Person } from '../models/person.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private people: Person[] = [
    { id: 1, name: 'Kusuma Nammi', age: 20, gender: 'Female', phone: '9392504116' },
    { id: 2, name: 'Jahnavi', age: 18, gender: 'Female', phone: '9030436909' }
  ];
  private nextId = 3;

  constructor() { }

  getPeople(): Observable<Person[]> {
    return of([...this.people]);
  }

  getPerson(id: number): Observable<Person | undefined> {
    const person = this.people.find(p => p.id === id);
    return of(person ? { ...person } : undefined);
  }

  addPerson(person: Person): Observable<Person> {
    const newPerson = { ...person, id: this.nextId++ };
    this.people.push(newPerson);
    return of(newPerson);
  }

  updatePerson(person: Person): Observable<Person> {
    const index = this.people.findIndex(p => p.id === person.id);
    if (index !== -1) {
      this.people[index] = { ...person };
      return of(this.people[index]);
    }
    throw new Error('Person not found');
  }

  deletePerson(id: number): Observable<boolean> {
    const index = this.people.findIndex(p => p.id === id);
    if (index !== -1) {
      this.people.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
