import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { finalize } from 'rxjs';
import { IntPaymentService, InterestPaymentRecord } from './int-payments.service';

@Component({
  selector: 'app-int-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe, NgxPaginationModule],
  templateUrl: './int-payments.html',
  styleUrl: './int-payments.css',
})
export class IntPayments implements OnInit {

  // State
  records: InterestPaymentRecord[] = [];
  isLoading: boolean = false;

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 10;

  // Search State
  searchTerm: string = '';
  searchTimeout: any;

  constructor(
    private service: IntPaymentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.service.getAll(this.searchTerm)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.records = data;
          this.currentPage = 1;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.records = [];
        }
      });
  }

  // --- Actions ---

  onSearchChange(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.loadData();
    }, 300);
  }

  onCreateNew(): void {
    this.router.navigate(['int-payment']);
  }

  onEdit(id: number): void {
    this.router.navigate(['int-payment'], { queryParams: { id: id } });
  }

  onDelete(record: InterestPaymentRecord): void {
    if (confirm(`Are you sure you want to delete Payment ${record.paymentNo}?`)) {
      this.isLoading = true;
      this.service.delete(record.id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
