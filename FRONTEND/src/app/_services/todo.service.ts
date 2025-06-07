import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private apiUrl = 'http://localhost:8080/api/todo';

    constructor(private http: HttpClient) {}
    
    addTodo(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }


    
}
