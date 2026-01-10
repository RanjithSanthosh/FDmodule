import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

export interface DepositRecord {
  id: number;
  series: string;
  depositNo: string;
  date: string;
  partyCode: string;
  partyName: string;
  depScheme: string;
  depositAmount: number | null;
  period: number | null;
  interestFrequency: string;
  rateOfInterest: number | null;
  matureDate: string;
  matureAmount: number | null;
  tdsPercent: number | null;
  paymentMode: string;
}

@Injectable({
  providedIn: 'root',
})
export class DepositsService {
  private readonly endpoint = 'deposits.json';

  constructor(private api: ApiService) {}
  getAll(searchTerm: string = ''): Observable<DepositRecord[]> {
    return this.api.get<DepositRecord[]>(this.endpoint).pipe(
      map((records) => {
        if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          return records.filter(
            (r) =>
              r.partyName.toLowerCase().includes(lowerTerm) ||
              r.depositNo.toLowerCase().includes(lowerTerm)
          );
        }
        return records;
      })
    );
  }

  getById(id: number): Observable<DepositRecord | undefined> {
    return this.api
      .get<DepositRecord[]>(this.endpoint)
      .pipe(map((records) => records.find((r) => r.id === id)));
  }

  create(data: any): Observable<any> {
    return this.api.post<DepositRecord[]>(this.endpoint, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.api.put<DepositRecord[]>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.api.delete<DepositRecord[]>(`${this.endpoint}/${id}`);
  }
}
