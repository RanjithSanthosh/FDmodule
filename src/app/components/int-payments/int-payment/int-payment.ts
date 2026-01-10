import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IntPaymentService, InterestPaymentRecord, LoanDetails } from '../int-payments.service';

interface FormErrors {
  [key: string]: string;
}

@Component({
  selector: 'app-interest-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './int-payment.html',
  styleUrl: './int-payment.css',
})
export class IntPayment implements OnInit {
  today = new Date().toISOString().split('T')[0];

  // Initialize Form Data
  payment: InterestPaymentRecord = {
    id: 0,
    series: 'IntPmt Main',
    paymentNo: '',
    date: this.today,
    depositNo: '',
    partyName: '',
    depScheme: '',
    interestAmount: 0, // Initialize with 0 or null, logic handles null checks
    interestRateInfo: '',
    tdsPercent: 10.0,
    tdsAmount: 0,
    oldTdsBalance: 0,
    addLessType: 'Add',
    addLessAmount: 0,
    nettPayable: 0,
    payMode: '',
    remarks: '',
    loanDetails: {
      depositScheme: '',
      depositDate: '',
      depositAmount: null,
      lastPaymentDate: '',
      matureDate: '',
      totalPeriod: '',
    },
  };

  errors: FormErrors = {};
  isEditMode: boolean = false;
  isLoading: boolean = false;

  paymentModes = ['Cash', 'Cheque', 'Bank Transfer', 'UPI'];
  addLessOptions: ('Add' | 'Less')[] = ['Add', 'Less'];

  constructor(
    private service: IntPaymentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.loadRecord(+id);
      } else {
        this.payment.paymentNo = 'IP' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      }
    });
  }

  loadRecord(id: number): void {
    this.isLoading = true;
    this.service.getById(id).subscribe({
      next: (record) => {
        if (record) {
          this.payment = { ...record };
        } else {
          alert('Record not found');
          this.router.navigate(['/int-payment']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading record', err);
        this.isLoading = false;
      }
    });
  }

  calculateTotals() {
    const intAmount = this.payment.interestAmount || 0;
    const tdsPct = this.payment.tdsPercent || 0;
    const adjAmount = this.payment.addLessAmount || 0;

    let calculatedTds = (intAmount * tdsPct) / 100;
    this.payment.tdsAmount = Math.round(calculatedTds * 100) / 100;

    let nett = intAmount - (this.payment.tdsAmount || 0);
    if (this.payment.addLessType === 'Add') {
      nett += adjAmount;
    } else {
      nett -= adjAmount;
    }
    this.payment.nettPayable = Math.round(nett * 100) / 100;
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.payment.date) {
      this.errors['date'] = 'Date is required.';
      isValid = false;
    }
    if (!this.payment.depositNo) {
      this.errors['depositNo'] = 'Deposit No is required.';
      isValid = false;
    }
    if (this.payment.interestAmount === null || this.payment.interestAmount <= 0) {
      this.errors['interestAmount'] = 'Valid Interest Amount is required.';
      isValid = false;
    }
    if (this.payment.tdsPercent === null || this.payment.tdsPercent < 0) {
      this.errors['tdsPercent'] = 'Valid TDS % is required.';
      isValid = false;
    }
    if (!this.payment.payMode) {
      this.errors['payMode'] = 'Payment Mode is required.';
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    this.calculateTotals();

    if (this.validateForm()) {
      this.isLoading = true;
      if (this.isEditMode) {
        this.service.update(this.payment.id, this.payment).subscribe(() => {
          alert('Interest Payment Updated Successfully!');
          this.router.navigate(['/int-payment']);
        });
      } else {
        this.service.create(this.payment).subscribe(() => {
          alert('Interest Payment Created Successfully!');
          this.router.navigate(['/int-payment']);
        });
      }
    } else {
      console.error('Validation Failed:', this.errors);
    }
  }

  onCancel() {
    this.router.navigate(['/int-payment']);
  }

  clearError(field: string) {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }

  onDepositNoChange() {
    this.clearError('depositNo');
    // Mock simulation logic retained for demo
    if (this.payment.depositNo === 'FD001') {
      this.payment.partyName = 'John Doe';
      this.payment.depScheme = 'Standard Monthly Income';
      this.payment.loanDetails = {
        depositScheme: 'Standard Monthly Income',
        depositDate: '2024-01-15',
        depositAmount: 500000,
        lastPaymentDate: '2024-11-15',
        matureDate: '2026-01-15',
        totalPeriod: '24 Months',
      };
    }
  }
}
