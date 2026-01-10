import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClosureService, ClosureRecord } from './closure.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-closure-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CurrencyPipe,
    NgxPaginationModule,
  ],
  templateUrl: './closures.html',
  styleUrl: './closures.css',
})
export class Closures implements OnInit {
  // State
  records: ClosureRecord[] = [];
  isLoading: boolean = false;

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 10; // Items per page

  // Search State
  searchTerm: string = '';
  searchTimeout: any;

  constructor(private closureService: ClosureService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.closureService
      .getClosures(this.searchTerm)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.records = data;
          this.currentPage = 1; // Reset to first page on new data
        },
        error: (err) => {
          console.error('API Error:', err);
          this.records = [];
        },
      });
  }

  // --- Actions ---

  onSearchChange(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.loadData(); // Reload data which is filtered in service
    }, 300);
  }

  onCreateNew(): void {
    this.router.navigate(['closure']);
  }

  onEdit(id: number): void {
    this.router.navigate(['closure'], { queryParams: { id: id } });
  }

  onDelete(record: ClosureRecord): void {
    if (
      confirm(`Are you sure you want to delete Payment ${record.paymentNo}?`)
    ) {
      this.isLoading = true;
      this.closureService.deleteClosure(record.id).subscribe(() => {
        this.loadData();
      });
    }
  }
}