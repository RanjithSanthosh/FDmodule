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
    id: 0,
    schemeName: '',
    period: '',
    interestFrequency: 'Bi Monthly',
    rateOfInterest: null,
    calcBasis: 'Daily',
    calculationMethod: 'Simple',
    calcPeriod: '',
    initialSkipPeriod: '',
    status: 'Active',
  };

  // Configuration
  config = {
    frequencies: ['Monthly', 'Bi Monthly', 'Quarterly', 'Half Yearly', 'Yearly'],
    bases: ['Daily', 'Monthly', '365 Days', '360 Days'],
    methods: ['Simple', 'Compound'],
    statuses: ['Active' as const, 'Inactive' as const],
  };

  // Error State
  errors: FormErrors = {};

  constructor(
    private service: SchemesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
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
      }
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

    if (!data.schemeName?.trim()) setError('schemeName', 'Scheme Name is required.');
    if (!data.period?.trim()) setError('period', 'Period duration is required.');

    if (data.rateOfInterest === null || data.rateOfInterest === undefined) {
      setError('rateOfInterest', 'Interest rate is required.');
    } else if (data.rateOfInterest < 0 || data.rateOfInterest > 100) {
      setError('rateOfInterest', 'Rate must be between 0% and 100%.');
    }

    return isValid;
  }

  onSubmit() {
    this.isSubmitting = true;

    if (this.validateForm()) {
      if (this.isEditMode) {
        this.service.update(this.formData.id, this.formData).subscribe(() => {
          alert('Scheme updated successfully!');
          this.router.navigate(['/schemes']);
        });
      } else {
        this.service.create(this.formData).subscribe(() => {
          alert('Scheme created successfully!');
          this.router.navigate(['/schemes']);
        });
      }
    } else {
      const firstError = Object.keys(this.errors)[0];
      document.getElementById(firstError)?.focus();
    }
    this.isSubmitting = false;
  }

  onCancel() {
    this.router.navigate(['/schemes']);
  }
}
