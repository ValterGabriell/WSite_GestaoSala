import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './AuthService';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.auth.isTokenValid()) return true;
        this.auth.clearAuth();
        this.router.navigate(['/login']);
        return false;
    }
}