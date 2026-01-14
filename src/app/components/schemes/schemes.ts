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
  allRecords: DepositScheme[] = [];
  isLoading: boolean = false;

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 10;

  // Search State
  searchTerm: string = '';
  searchTimeout: any;

  constructor(private service: SchemesService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.service
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.allRecords = data;
          this.applyFilter();
          console.log("Schemes Data", data);

        },
        error: (err) => {
          console.error('API Error in Component:', err);
          // Show the error to the user if it's our thrown error
          if (err.message) {
            alert('Failed to load schemes: ' + err.message);
          }
          this.records = [];
          this.allRecords = [];
        },
      });
  }

  applyFilter(): void {
    if (this.searchTerm) {
      const lowerTerm = this.searchTerm.toLowerCase();
      this.records = this.allRecords.filter((r) =>
        r.Scheme_Name.toLowerCase().includes(lowerTerm)
      );
    } else {
      this.records = [...this.allRecords];
    }
    this.currentPage = 1;
  }

  // --- Actions ---

  onSearchChange(): void {
    this.applyFilter();
  }

  onCreateNew(): void {
    this.router.navigate(['fdfrontend/scheme']);
  }

  onEdit(id: number): void {
    this.router.navigate(['fdfrontend/scheme'], { queryParams: { id: id } });
  }

  onDelete(record: DepositScheme): void {
    if (
      confirm(`Are you sure you want to delete Scheme ${record.Scheme_Name}?`)
    ) {
      if (!record.SchemeSno) return;

      this.isLoading = true;
      this.service.delete(record.SchemeSno).subscribe(() => {
        this.loadData();
      });
    }
  }
}
