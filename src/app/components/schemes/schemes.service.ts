import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

export interface DepositScheme {
  id: number;
  schemeName: string;
  period: string;
  interestFrequency: string;
  rateOfInterest: number | null;
  calcBasis: string;
  calculationMethod: string;
  calcPeriod: string;
  initialSkipPeriod: string;
  status: 'Active' | 'Inactive';
}

@Injectable({
  providedIn: 'root',
})
export class SchemesService {
  private readonly endpoint = 'schemes.json';

  constructor(private api: ApiService) {}

  getAll(searchTerm: string = ''): Observable<DepositScheme[]> {
    return this.api.get<DepositScheme[]>(this.endpoint).pipe(
      map((records) => {
        if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          return records.filter((r) =>
            r.schemeName.toLowerCase().includes(lowerTerm)
          );
        }
        return records;
      })
    );
  }

  getById(id: number): Observable<DepositScheme | undefined> {
    return this.api
      .get<DepositScheme[]>(this.endpoint)
      .pipe(map((records) => records.find((r) => r.id === id)));
  }

  create(data: any): Observable<any> {
    return this.api.post<DepositScheme[]>(this.endpoint, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.api.put<DepositScheme[]>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.api.delete<DepositScheme[]>(`${this.endpoint}/${id}`);
  }
}
