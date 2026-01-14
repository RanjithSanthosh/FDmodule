import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepositorsService, DepositorRecord } from './depositors.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-depositors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    NgxPaginationModule,
  ],
  templateUrl: './depositors.html',
  styleUrl: './depositors.css',
})
export class Depositors implements OnInit {
  records: DepositorRecord[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Search
  searchTerm: string = '';
  searchTimeout: any;

  constructor(private depositorsService: DepositorsService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.depositorsService
      .getDepositors(this.searchTerm)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.records = data;
          this.currentPage = 1;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.records = [];
        },
      });
  }

  onSearchChange(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadData();
    }, 300);
  }

  onCreateNew(): void {
    this.router.navigate(['fdfrontend/depositor']);
  }

  onEdit(id: number): void {
    this.router.navigate(['fdfrontend/depositor'], { queryParams: { id: id } });
  }

  onDelete(record: DepositorRecord): void {
    if (confirm(`Are you sure you want to delete Depositor ${record.name}?`)) {
      this.isLoading = true;
      this.depositorsService.deleteDepositor(record.id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
