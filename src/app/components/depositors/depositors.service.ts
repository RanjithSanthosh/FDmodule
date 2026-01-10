import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

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
