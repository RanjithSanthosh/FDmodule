import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Deposit } from '../deposits/deposit/deposit';

export interface DepositorRecord {
    id: number;
    code: string;
    name: string;
    so: string;
    sex: string;
    communicationAddress: string;
    city: string;
    pinCode: string;
    state: string;
    mobile: string;
    aadharNo: string;
    email: string;
    nominee: string;
    dob: string;
    age: number;
    remarks: string;
    createdDate: string;
    photoUrl?: string;
}

@Injectable({
    providedIn: 'root',
})
export class DepositorsService {

    private readonly endpoint = 'depositors.json';

    constructor(private api: ApiService) { }

    private getHeaders():HttpHeaders{
        let token = localStorage.getItem('authToken');
        if(!token){
            const userStr = localStorage.getItem('currentUser');
            if(userStr){
                try{
                    const user = JSON.parse(userStr);
                    if(user.apiData && user.apiData.AuthToken){
                        token = user.apiData.AuthToken;
                        localStorage.setItem('authToken', token || '');
                    }
                }
                catch(e){
                    console.log('Error parsing currentUser for token fallback', e);
                    
                }
            }
        }
        console.log("Depositors Service using the token",
            token?'Found':'Missing',token,
        );
        
        return new HttpHeaders({
            Authorization: `Bearer ${token || ''}`
        })
    }

    private parserResponse(response:any):any{
        if(typeof response == 'string'){
            try{
                const jsonStart = response.indexOf('{');
                if(jsonStart != -1){
                    return JSON.parse(response.substring(jsonStart));
                    
                }
            }
            catch(e){
                console.log('json parse error:',e);
                
            }
            return response
        }
    }
    getAll(): Observable<DepositorRecord[]> {
        let compSno=1;
        let appPass ='';
        try{
            appPass = localStorage.getItem('app_pwd_temp') || '';
        }
        catch(e){
            console.log('Error while parsing user info',e);
            
        }
        const body= new HttpParams().set('clientCode','dempoaccount')
        .set('data',JSON.stringify(
            {
                compSno:compSno,
                appPass:appPass
            }
        ));
        return this.api.post(this.endpoint,body,
            {
                header: this.getHeaders(),
               
            }
        ).pipe(
            map((response:any) => {  
                if(response.queryStatus == 1 && response.apiData){
                    return JSON.parse(response.apiData)
                }
            })
        )
    }

    getDepositors(searchTerm: string = ''): Observable<DepositorRecord[]> {
        return this.api.get<DepositorRecord[]>(this.endpoint).pipe(
            map((records) => {
                if (searchTerm) {
                    const lowerTerm = searchTerm.toLowerCase();
                    return records.filter(
                        (r) =>
                            r.name.toLowerCase().includes(lowerTerm) ||
                            r.code.toLowerCase().includes(lowerTerm) ||
                            r.mobile.includes(searchTerm)
                    );
                }
                return records;
            })
        );
    }

    getById(id: number): Observable<DepositorRecord | undefined> {
        return this.api
            .get<DepositorRecord[]>(this.endpoint)
            .pipe(map((records) => records.find((r) => r.id === id)));
    }

    createDepositor(data: any): Observable<any> {
        return this.api.post<DepositorRecord[]>(this.endpoint, data);
    }

    updateDepositor(id: number, data: any): Observable<any> {
        return this.api.put<DepositorRecord[]>(`${this.endpoint}/${id}`, data);
    }

    deleteDepositor(id: number): Observable<any> {
        return this.api.delete<DepositorRecord[]>(`${this.endpoint}/${id}`);
    }
}
