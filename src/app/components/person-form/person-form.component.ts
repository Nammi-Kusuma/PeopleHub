import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class PersonFormComponent implements OnInit {
  personForm: FormGroup;
  isEditMode = false;
  personId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      gender: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{9,15}$/)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.personId = +id;
      this.loadPerson(this.personId);
    }
  }

  loadPerson(id: number): void {
    this.personService.getPerson(id).subscribe(person => {
      if (person) {
        this.personForm.patchValue(person);
      }
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const person: Person = this.personForm.value;
      
      if (this.isEditMode && this.personId) {
        person.id = this.personId;
        this.personService.updatePerson(person).subscribe(() => {
          this.router.navigate(['/']);
        });
      } else {
        this.personService.addPerson(person).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  get name() { return this.personForm.get('name'); }
  get age() { return this.personForm.get('age'); }
  get gender() { return this.personForm.get('gender'); }
  get phone() { return this.personForm.get('phone'); }
}
