import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

export interface DepositScheme {
  SchemeSno?: number;
  Scheme_Name: string;
  Dep_Period: number;
  Int_Frequency: number;
  Roi: number;
  Calc_Basis: number;
  Calc_Method: number;
  Calc_Period: number;
  Intial_Skip_Period: number;
  Active_Status: number;
  Remarks: string;
  Create_Date?: number;
  UserSno?: number;
  CompSno?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SchemesService {
  private readonly getEndpoint = 'app/getDepSchemes';
  private readonly saveEndpoint = 'app/saveDepScheme';
  private readonly deleteEndpoint = 'app/deleteDepScheme';

  constructor(private api: ApiService) { }

  private getHeaders(): HttpHeaders {
    let token = localStorage.getItem('authToken');

    if (!token) {
      // Fallback: try to find it in currentUser
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.apiData && user.apiData.AuthToken) {
            token = user.apiData.AuthToken;
            // Heal self by saving it
            localStorage.setItem('authToken', token || '');
          }
        } catch (e) {
          console.error('Error parsing currentUser for token fallback', e);
        }
      }
    }

    console.log('SchemesService using token:', token ? 'Found' : 'Missing', token);

    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  private parseResponse(response: any): any {
    if (typeof response === 'string') {
      try {
        const jsonStart = response.indexOf('{');
        if (jsonStart !== -1) {
          return JSON.parse(response.substring(jsonStart));
        }
      } catch (e) {
        console.error('JSON Parse Error', e);
      }
    }
    return response;
  }

  getAll(searchTerm: string = ''): Observable<DepositScheme[]> {
    let compSno = 0;
    // let branchSno = 0;

    let appPwd = '';
    try {
      appPwd = localStorage.getItem('app_pwd_temp') || '';

      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.apiData && user.apiData.CompInfo && user.apiData.CompInfo.length > 0) {
          compSno = user.apiData.CompInfo[0].CompSno;
        }
      }
    } catch (e) {
      console.error('Error parsing user info', e);
    }

    const body = new HttpParams()
      .set('DbName', 'demoaccount')
      .set('data', JSON.stringify({
        SchemeSno: 0,
        CompSno: compSno,
        App_Pwd: appPwd
      }));

    return this.api.post(this.getEndpoint, body, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      map((rawResponse) => {
        const response = this.parseResponse(rawResponse);
        if (response && response.queryStatus === 1 && response.apiData) {
          let data = [];
          if (Array.isArray(response.apiData)) {
            data = response.apiData;
          } else if (response.apiData && Array.isArray(response.apiData.Schemes)) {
            data = response.apiData.Schemes;
            
          } else {
            // Fallback: try to find an array in apiData
            const keys = Object.keys(response.apiData);
            for (const key of keys) {
              if (Array.isArray(response.apiData[key])) {
                data = response.apiData[key];
                break;
              }
            }
          }
          if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            return data.filter((r: DepositScheme) =>
              r.Scheme_Name.toLowerCase().includes(lowerTerm)
            );
          }
          return data;
        }
        return [];
      })
    );
  }

  getById(id: number): Observable<DepositScheme | undefined> {
    return this.getAll().pipe(
      map((records: DepositScheme[]) => records.find(r => r.SchemeSno === id))
    );
  }

  save(data: DepositScheme): Observable<any> {
    const body = new HttpParams()
      .set('DbName', 'demoaccount')
      .set('data', JSON.stringify(data));

    return this.api.post(this.saveEndpoint, body, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(map(this.parseResponse));
  }

  delete(id: number): Observable<any> {
    const body = new HttpParams()
      .set('DbName', 'demoaccount')
      .set('data', JSON.stringify({ SchemeSno: id }));

    return this.api.post(this.deleteEndpoint, body, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(map(this.parseResponse));

  //   map(response => this.parseResponse(response))
   }
}
