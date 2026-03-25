import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private decodeToken(token: string): any {
        try {
            const payload = token.split('.')[1];
            const decoded = atob(payload);
            return JSON.parse(decoded);
        } catch {
            return null;
        }
    }

    getUserName(): string {
        const token = localStorage.getItem('accessToken');
        if (!token) return 'User';
        const decoded = this.decodeToken(token);
        return decoded?.name;
    }

    getRoles(): number[] {
        const token = localStorage.getItem('accessToken');
        if (!token) return [];

        const decoded = this.decodeToken(token);

        const roles = decoded?.roleIds;

        if (!roles) return [];

        // Case 1: already array
        if (Array.isArray(roles)) {
            return roles.map(Number);
        }

        // Case 2: single value
        return [Number(roles)];
    }

    isAdmin(): boolean {
        return this.getRoles().some(x => x == 1);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('accessToken');
    }

    clearTokens(): void {
        localStorage.clear();
    }
}