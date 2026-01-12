import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemesService, DepositScheme } from '../schemes.service';

export interface FormErrors {
  [key: string]: string | null;
}

@Component({
  selector: 'app-deposit-scheme',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scheme.html',
  styleUrl: './scheme.css',
})
export class Scheme implements OnInit {
  // --- State ---
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  formData: DepositScheme = {
    SchemeSno: 0,
    Scheme_Name: '',
    Dep_Period: 0,
    Int_Frequency: 2, // Default Bi Monthly?
    Roi: 0,
    Calc_Basis: 1, // Default Daily
    Calc_Method: 1, // Default Simple
    Calc_Period: 0,
    Intial_Skip_Period: 0,
    Active_Status: 1,
    Remarks: ''
  };

  // Configuration
  config = {
    frequencies: [
      { id: 1, label: 'Monthly' },
      { id: 2, label: 'Bi Monthly' },
      { id: 3, label: 'Quarterly' },
      { id: 4, label: 'Half Yearly' },
      { id: 5, label: 'Yearly' },
    ],
    bases: [
      { id: 1, label: 'Daily' },
      { id: 2, label: 'Monthly' },
      { id: 3, label: '365 Days' },
      { id: 4, label: '360 Days' },
    ],
    methods: [
      { id: 1, label: 'Simple' },
      { id: 2, label: 'Compound' },
    ],
    statuses: [
      { id: 1, label: 'Active' },
      { id: 0, label: 'Inactive' },
    ],
  };

  // Error State
  errors: FormErrors = {};

  constructor(
    private service: SchemesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.loadRecord(+id);
      }
    });
  }

  loadRecord(id: number): void {
    this.isLoading = true;
    this.service.getById(id).subscribe({
      next: (record) => {
        if (record) {
          this.formData = { ...record };
        } else {
          alert('Record not found');
          this.router.navigate(['/schemes']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading record', err);
        this.isLoading = false;
      },
    });
  }

  // --- Actions ---

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;
    const data = this.formData;

    const setError = (field: string, msg: string) => {
      this.errors[field] = msg;
      isValid = false;
    };

    if (!data.Scheme_Name?.trim())
      setError('Scheme_Name', 'Scheme Name is required.');

    if (!data.Dep_Period || data.Dep_Period <= 0)
      setError('Dep_Period', 'Period duration must be greater than 0.');

    if (data.Roi === null || data.Roi === undefined) {
      setError('Roi', 'Interest rate is required.');
    } else if (data.Roi < 0 || data.Roi > 100) {
      setError('Roi', 'Rate must be between 0% and 100%.');
    }

    return isValid;
  }

  onSubmit() {
    this.isSubmitting = true;

    if (this.validateForm()) {
      this.service.save(this.formData).subscribe({
        next: () => {
          alert(this.isEditMode ? 'Scheme updated successfully!' : 'Scheme created successfully!');
          this.router.navigate(['/schemes']);
        },
        error: (err) => {
          console.error('Save failed', err);
          alert('Failed to save scheme.');
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      const firstError = Object.keys(this.errors)[0];
      document.getElementById(firstError)?.focus();
      this.isSubmitting = false;
    }
  }

  onCancel() {
    this.router.navigate(['/schemes']);
  }
}
