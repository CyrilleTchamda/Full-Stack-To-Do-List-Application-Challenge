import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private apiUrl = 'http://localhost:8080/api/user/register';

    constructor(private http: HttpClient) {}

    registerUser(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }
}
