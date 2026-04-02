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
        const token = this.getAccessToken();
        if (!token) return 'User';
        const decoded = this.decodeToken(token);
        return decoded?.name;
    }

    getRoles(): number[] {
        const token = this.getAccessToken();

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
        return !!this.getAccessToken();
    }

    /** True if access token is expired (or absent) */
    isAccessTokenExpired(): boolean {
        return this.isTokenExpired(this.getAccessToken());
    }

    private isTokenExpired(token: string | null): boolean {
        if (!token) return true;
        const payload = this.decodeToken(token);
        if (!payload?.exp) return true;
        return payload.exp * 1000 < Date.now();
    }

    // ── Token accessors ─────────────────────────────────────────

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    // Add this method — tokens are written only through TokenService
    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    clearTokens(): void {
        localStorage.clear();
    }
}