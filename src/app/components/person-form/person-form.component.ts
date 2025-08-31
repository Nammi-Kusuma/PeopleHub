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
  personId: string | null = null;
  genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];
  isLoading = false;
  errorMessage = '';

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
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{9,15}$/)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.personId = id;
      this.loadPerson(this.personId);
    }
  }

  loadPerson(id: string): void {
    this.isLoading = true;
    this.personService.getPerson(id).subscribe({
      next: (person) => {
        if (person) {
          this.personForm.patchValue(person);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load person details';
        this.isLoading = false;
        console.error('Error loading person:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const personData = this.personForm.value;
    const personOperation = this.isEditMode && this.personId
      ? this.personService.updatePerson(this.personId, personData)
      : this.personService.addPerson(personData);

    personOperation.subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = this.isEditMode 
          ? 'Failed to update person. Please try again.' 
          : 'Failed to add person. Please try again.';
        this.isLoading = false;
        console.error('Error saving person:', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  // Form control getters for template access
  get name() { return this.personForm.get('name'); }
  get age() { return this.personForm.get('age'); }
  get gender() { return this.personForm.get('gender'); }
  get mobileNumber() { return this.personForm.get('mobileNumber'); }
}
