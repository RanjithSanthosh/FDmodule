// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// @Injectable({
//   providedIn: 'root',
// })
// export class HttpService {
//   private readonly apiUrl = '/assets/data/closures'; // Base API URL
//   constructor(private http: HttpClient){}

//   get<T>(endpoint: string): Observable<T> {
//     return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
//   }
//   post<T>(endpoint:string,body:any):Observable<T>{
//     return this.http.post<T>(`${this.apiUrl}/${endpoint}`,body);
//   } 
//   put<T>(endpoint:string,body:any):Observable<T>{
//     return this.http.put<T>(`${this.apiUrl}/${endpoint}`,body);
//   }
//   delete<T>(endpoint:string):Observable<T>{
//     return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
//   }
// }



import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Using root relative path to access public folder directly or API proxy
  private baseUrl = '/data';

  constructor(private http: HttpClient) { }

  get<T>(path: string, params: any = {}): Observable<T> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<T>(`${this.baseUrl}/${path}`, { params: httpParams });
  }

  post<T>(path: string, body: any, options: any = {}): Observable<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}/${path}`;
    return this.http.post<T>(url, body, options) as Observable<T>;
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`);
  }
}
