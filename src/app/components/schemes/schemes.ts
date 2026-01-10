import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { finalize } from 'rxjs';
import { SchemesService, DepositScheme } from './schemes.service';

@Component({
  selector: 'app-schemes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './schemes.html',
  styleUrl: './schemes.css',
})
export class Schemes implements OnInit {

  // State
  records: DepositScheme[] = [];
  isLoading: boolean = false;

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 10;

  // Search State
  searchTerm: string = '';
  searchTimeout: any;

  constructor(
    private service: SchemesService,
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
    this.router.navigate(['scheme']);
  }

  onEdit(id: number): void {
    this.router.navigate(['scheme'], { queryParams: { id: id } });
  }

  onDelete(record: DepositScheme): void {
    if (confirm(`Are you sure you want to delete Scheme ${record.schemeName}?`)) {
      this.isLoading = true;
      this.service.delete(record.id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
