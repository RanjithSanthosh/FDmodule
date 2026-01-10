import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClosureService, ClosureRecord } from '../closure.service';

// interface ClosureFormData
//   extends Omit<ClosureRecord, 'id' | 'interestAmount' | 'nettPayable'> {
//   // Using Omit to ensure compat, adding id optionally for internal tracking if needed
//   id?: number;
//   interestAmount: number | null;
//   nettPayable: number | null;
// }

interface ClosureFormData extends ClosureRecord {}

interface FormErrors {
  [key: string]: string | null;
}

@Component({
  selector: 'app-closure',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterLink],
  templateUrl: './closure.html',
  styleUrls: ['./closure.css'],
})
export class Closure implements OnInit {
  formData: ClosureFormData = {
    id: 0,
    series: 'FClosure Main',
    paymentNo: '',
    transactionDate: new Date().toISOString().split('T')[0],
    depositNo: '',
    partyName: '',
    depScheme: '',
    interestAmount: null,
    tdsPercent: null,
    oldTdsBalance: null,
    addLessMode: 'Add',
    nettPayable: null,
    payMode: '',
    remarks: '',
  };

  errors: FormErrors = {};
  isEditMode: boolean = false;
  recordId: number | null = null;
  isLoading: boolean = false;

  addLessOptions: string[] = ['Add', 'Less'];
  payModeOptions = ['Cash', 'Bank Transfer', 'Cheque'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private closureService: ClosureService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.recordId = +id;
        this.loadRecord(this.recordId);
      } else {
        // Initialize with default values for new record
        this.formData.paymentNo =
          'FC' +
          Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0');
      }
    });

    this.calculateFinancials();
  }

  loadRecord(id: number): void {
    this.isLoading = true;
    this.closureService.getById(id).subscribe({
      next: (record) => {
        if (record) {
          // Clone the record to avoid direct mutation issues
          this.formData = { ...record };
          // Ensure dates are strings for inputs
          if (this.formData.transactionDate) {
            this.formData.transactionDate =
              this.formData.transactionDate.split('T')[0];
          }
        } else {
          alert('Record not found');
          this.router.navigate(['/closures']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading record', err);
        this.isLoading = false;
      },
    });
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    const setError = (
      field: keyof ClosureFormData | string,
      message: string
    ) => {
      this.errors[field] = message;
      isValid = false;
    };

    if (!this.formData.series?.trim())
      setError('series', 'Series is required.');
    if (!this.formData.paymentNo?.trim())
      setError('paymentNo', 'Payment No is required.');
    if (!this.formData.transactionDate)
      setError('transactionDate', 'Date is required.');
    if (!this.formData.partyName?.trim())
      setError('partyName', 'Party Name is required.');
    if (!this.formData.payMode?.trim())
      setError('payMode', 'Please select a Pay Mode.');

    if (
      this.formData.interestAmount === null ||
      this.formData.interestAmount < 0
    ) {
      setError('interestAmount', 'Valid Interest Amount is required.');
    }

    if (this.formData.tdsPercent !== null) {
      if (this.formData.tdsPercent < 0 || this.formData.tdsPercent > 100) {
        setError('tdsPercent', 'TDS % must be between 0 and 100.');
      }
    }

    return isValid;
  }

  calculateFinancials(): void {
    const interest = this.formData.interestAmount || 0;
    const tdsPct = this.formData.tdsPercent || 0;
    const oldTds = this.formData.oldTdsBalance || 0;

    let calculated = interest;

    if (tdsPct > 0) {
      calculated = calculated - calculated * (tdsPct / 100);
    }

    if (this.formData.addLessMode === 'Add') {
      calculated += oldTds;
    } else {
      calculated -= oldTds;
    }

    this.formData.nettPayable = Math.max(0, parseFloat(calculated.toFixed(2)));
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.isLoading = true;
      if (this.isEditMode && this.recordId) {
        this.closureService
          .updateClosure(this.recordId, this.formData)
          .subscribe(() => {
            this.isLoading = false;
            alert('Closure updated successfully!');
            this.router.navigate(['/closures']);
          });
      } else {
        this.closureService.createClosure(this.formData).subscribe(() => {
          this.isLoading = false;
          alert('Closure created successfully!');
          this.router.navigate(['/closures']);
        });
      }
    } else {
      console.error('Form contains errors.', this.errors);
      const firstErrorKey = Object.keys(this.errors)[0];
      if (firstErrorKey) {
        const element = document.getElementById(firstErrorKey);
        element?.focus();
      }
    }
  }
}
