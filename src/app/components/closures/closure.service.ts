import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

export interface ClosureRecord {
  id: number;
  series: string;
  paymentNo: string;
  transactionDate: string;
  depositNo: string;
  partyName: string;
  depScheme: string;
  interestAmount: number| null;
  tdsPercent: number | null;
  oldTdsBalance: number | null;
  addLessMode: string;
  nettPayable: number |null;
  payMode: string;
  remarks: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClosureService {
  private readonly endpoint = 'closures.json';

  constructor(private api: ApiService) {}

  getClosures(searchTerm: string = ''): Observable<ClosureRecord[]> {
    return this.api.get<ClosureRecord[]>(this.endpoint).pipe(
      map((records) => {
        if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          return records.filter(
            (r) =>
              r.partyName.toLowerCase().includes(lowerTerm) ||
              r.paymentNo.toLowerCase().includes(lowerTerm)
          );
        }
        return records;
      })
    );
  }

  getById(id: number): Observable<ClosureRecord | undefined> {
    return this.api
      .get<ClosureRecord[]>(this.endpoint)
      .pipe(map((records) => records.find((r) => r.id === id)));
  }

  createClosure(data: any): Observable<any> {
    return this.api.post<ClosureRecord[]>(this.endpoint, data);
  }

  updateClosure(id: number, data: any): Observable<any> {
    return this.api.put<ClosureRecord[]>(`${this.endpoint}/${id}`, data);
  }

  deleteClosure(id: number): Observable<any> {
    return this.api.delete<ClosureRecord[]>(`${this.endpoint}/${id}`);
  }
}
