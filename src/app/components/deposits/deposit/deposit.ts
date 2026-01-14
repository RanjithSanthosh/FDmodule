import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DepositsService, DepositRecord } from '../deposits.service';

export interface FormErrors {
  [key: string]: string;
}

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css',
})
export class Deposit implements OnInit {
  deposit: DepositRecord = {
    id: 0,
    series: 'FD Main',
    depositNo: '',
    date: new Date().toISOString().split('T')[0],
    partyCode: '',
    partyName: '',
    depScheme: '',
    depositAmount: null,
    period: null,
    interestFrequency: 'Bi-Monthly',
    rateOfInterest: null,
    matureDate: '',
    matureAmount: null,
    tdsPercent: null,
    paymentMode: '',
  };

  errors: FormErrors = {};
  isEditMode: boolean = false;
  isLoading: boolean = false;

  schemes = ['Standard FD', 'Senior Citizen', 'Reinvestment Plan'];
  frequencies = ['Monthly', 'Bi-Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'];
  paymentModes = ['Cash', 'Cheque', 'NEFT/RTGS', 'UPI'];

  constructor(
    private service: DepositsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.loadRecord(+id);
      } else {
        this.deposit.depositNo =
          'FD' +
          Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0');
      }
    });
  }

  loadRecord(id: number): void {
    this.isLoading = true;
    this.service.getById(id).subscribe({
      next: (record) => {
        if (record) {
          this.deposit = { ...record };
          // Ensure input type="date" displays correctly
          if (this.deposit.date)
            this.deposit.date = this.deposit.date.split('T')[0];
          if (this.deposit.matureDate)
            this.deposit.matureDate = this.deposit.matureDate.split('T')[0];
        } else {
          alert('Record not found');
          this.router.navigate(['/fdfrontend/deposits']);
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

    if (!this.deposit.date) {
      this.errors['date'] = 'Date is required.';
      isValid = false;
    }
    if (!this.deposit.partyCode.trim()) {
      this.errors['partyCode'] = 'Party Code is required.';
      isValid = false;
    }
    if (!this.deposit.partyName.trim()) {
      this.errors['partyName'] = 'Party Name is required.';
      isValid = false;
    }
    if (!this.deposit.depScheme) {
      this.errors['depScheme'] = 'Scheme selection is required.';
      isValid = false;
    }
    if (!this.deposit.depositAmount || this.deposit.depositAmount <= 0) {
      this.errors['depositAmount'] = 'Valid amount is required.';
      isValid = false;
    }
    if (!this.deposit.period || this.deposit.period <= 0) {
      this.errors['period'] = 'Period is required.';
      isValid = false;
    }
    if (!this.deposit.interestFrequency) {
      this.errors['interestFrequency'] = 'Frequency is required.';
      isValid = false;
    }
    if (
      this.deposit.rateOfInterest === null ||
      this.deposit.rateOfInterest < 0
    ) {
      this.errors['rateOfInterest'] = 'ROI is required.';
      isValid = false;
    }
    if (!this.deposit.matureDate) {
      this.errors['matureDate'] = 'Maturity date is required.';
      isValid = false;
    }
    if (!this.deposit.paymentMode) {
      this.errors['paymentMode'] = 'Payment mode is required.';
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    if (this.validateForm()) {
      this.isLoading = true;
      if (this.isEditMode) {
        this.service.update(this.deposit.id, this.deposit).subscribe(() => {
          alert('Deposit Updated Successfully!');
          this.router.navigate(['/fdfrontend/deposits']); // Should be list
        });
      } else {
        this.service.create(this.deposit).subscribe(() => {
          alert('Deposit Created Successfully!');
          this.router.navigate(['/fdfrontend/deposits']); // Should be list
        });
      }
    } else {
      console.error('Validation Failed', this.errors);
    }
  }

  onCancel() {
    this.router.navigate(['/fdfrontend/deposits']); // Should be list
  }

  clearError(field: string) {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }

  private getFrequencyCount(freq: string): number {
    switch (freq) {
      case 'Monthly':
        return 12;
      case 'Bi-Monthly':
        return 6;
      case 'Quarterly':
        return 4;
      case 'Half-Yearly':
        return 2;
      case 'Yearly':
        return 1;
      default:
        return 0;
    }
  }

  calculateMaturity() {
    const P = this.deposit.depositAmount || 0;
    const R = this.deposit.rateOfInterest || 0;
    const months = this.deposit.period || 0;
    const freqString = this.deposit.interestFrequency;

    if (P <= 0 || R <= 0 || months <= 0 || !freqString) {
      this.deposit.matureAmount = null;
      return;
    }

    const n = this.getFrequencyCount(freqString);
    const t = months / 12;
    const ratePerPeriod = R / 100 / n;
    const totalPeriods = n * t;

    const maturityValue = P * Math.pow(1 + ratePerPeriod, totalPeriods);
    this.deposit.matureAmount = Math.round(maturityValue * 100) / 100;

    this.calculateMaturityDate(months);
  }

  calculateMaturityDate(months: number) {
    if (this.deposit.date && months > 0) {
      const startDate = new Date(this.deposit.date);
      startDate.setMonth(startDate.getMonth() + months);
      this.deposit.matureDate = startDate.toISOString().split('T')[0];
      this.clearError('matureDate');
    }
  }
}
