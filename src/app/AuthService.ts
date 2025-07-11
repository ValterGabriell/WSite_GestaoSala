import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token: string | null = null;
    private expiration: Date | null = null;
    private isAdmin: boolean = false;

    setAuth(data: { token: string, expiration: string, isAdmin: boolean }) {
        this.token = data.token;
        this.expiration = new Date(data.expiration);
        this.isAdmin = data.isAdmin;
        localStorage.setItem('token', data.token);
        localStorage.setItem('expiration', data.expiration);
        localStorage.setItem('isAdmin', String(data.isAdmin));
    }

    clearAuth() {
        this.token = null;
        this.expiration = null;
        this.isAdmin = false;
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('isAdmin');
    }

    getToken(): string | null {
        if (!this.token) this.token = localStorage.getItem('token');
        return this.token;
    }

    isTokenValid(): boolean {
        if (!this.expiration) {
            const exp = localStorage.getItem('expiration');
            if (exp) this.expiration = new Date(exp);
        }
        return !!this.getToken() && !!this.expiration && new Date() < this.expiration;
    }
}