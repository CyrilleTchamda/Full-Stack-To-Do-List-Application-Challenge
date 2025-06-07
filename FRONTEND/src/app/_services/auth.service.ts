import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private router: Router) {}

    getToken(): string | null | any {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token: string): boolean {
        try {
            const decoded: any = jwtDecode(token);
            const now = Date.now() / 1000; 
            return decoded.exp < now;
        } catch (error) {
            console.warn('Token invalide ou malformé', error);
            return true;
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
