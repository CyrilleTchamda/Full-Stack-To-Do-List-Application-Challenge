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

    
    getTodos(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    deleteTodo(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    updateTodo(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    }

    toggleTodo(id: number, done: boolean): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/status/${id}`, { done });
    }
}