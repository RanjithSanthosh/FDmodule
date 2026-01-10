import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

export interface LoanDetails {
  depositScheme: string;
  depositDate: string;
  depositAmount: number | null;
  lastPaymentDate: string;
  matureDate: string;
  totalPeriod: string;
}

export interface InterestPaymentRecord {
  id: number;
  series: string;
  paymentNo: string;
  date: string;
  depositNo: string;
  partyName: string;
  depScheme: string;
  interestAmount: number;
  interestRateInfo: string;
  tdsPercent: number | null;
  tdsAmount: number | null;
  oldTdsBalance: number | null;
  addLessType: 'Add' | 'Less';
  addLessAmount: number | null;
  nettPayable: number;
  payMode: string;
  remarks: string;
  loanDetails: LoanDetails;
}

@Injectable({
  providedIn: 'root'
})
export class IntPaymentService {
  private readonly endpoint = 'int-payments.json';

  constructor(private api: ApiService) { }

  getAll(searchTerm: string = ''): Observable<InterestPaymentRecord[]> {
    return this.api.get<InterestPaymentRecord[]>(this.endpoint).pipe(
      map(records => {
        if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          return records.filter(r =>
            r.partyName.toLowerCase().includes(lowerTerm) ||
            r.paymentNo.toLowerCase().includes(lowerTerm)
          );
        }
        return records;
      })
    );
  }

  getById(id: number): Observable<InterestPaymentRecord | undefined> {
    return this.api.get<InterestPaymentRecord[]>(this.endpoint).pipe(
      map(records => records.find(r => r.id === id))
    );
  }

  create(data: any): Observable<any> {
    return of(data).pipe(delay(500));
  }

  update(id: number, data: any): Observable<any> {
    return of(data).pipe(delay(500));
  }

  delete(id: number): Observable<any> {
    return of({ success: true }).pipe(delay(500));
  }
}
