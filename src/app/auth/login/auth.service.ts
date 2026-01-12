import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Log } from '../../log';
import { ApiService } from '../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/auth/CheckUserandgetCompanies';

    constructor(private api: ApiService, private logService: Log) { }

    login(App_Login: string, App_Pwd: string): Observable<any> {
        // Save credentials temporarily as requested by dynamic API requirements
        localStorage.setItem('app_login_temp', App_Login);
        localStorage.setItem('app_pwd_temp', App_Pwd);

        const body = new HttpParams()
            .set('DbName', 'demoaccount')
            .set('data', JSON.stringify({
                App_Login,
                App_Pwd
            }));

        // console.log("Body sending is :", body.toString());

        return this.api.post(this.apiUrl, body, { responseType: 'text' }).pipe(
            map((response: any) => {
                // The server might return PHP warnings/notices before the JSON
                console.log('Raw Response:', response);
                try {
                    const jsonStart = response.indexOf('{');
                    if (jsonStart !== -1) {
                        const jsonStr = response.substring(jsonStart);
                        return JSON.parse(jsonStr);
                    }
                } catch (e) {
                    console.error('JSON Parse Error:', e);
                }
                return null;
            }),
            tap((response: any) => {
                console.log('Login Response:', response);

                if (response && response.queryStatus === 1) {
                    this.logService.loggedin = true;
                    // Save the entire response
                    localStorage.setItem('currentUser', JSON.stringify(response));

                    // Also save the token specifically for easier access if needed
                    if (response.apiData && response.apiData.AuthToken) {
                        localStorage.setItem('authToken', response.apiData.AuthToken);
                    }
                }
            })
        );
    }

    logout() {
        this.logService.loggedin = false;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
    }
}