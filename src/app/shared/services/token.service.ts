import { Injectable } from '@angular/core';
import { AppUtil } from '../../core/utils/app.util';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private _decodeToken(token: string): any {
        try {
            const payload = token.split('.')[1];
            const decoded = atob(payload);
            return JSON.parse(decoded);
        } catch {
            return null;
        }
    }

    public getUserRoleCodes(): string[] {
        const token = this.getAccessToken();
        if (token) {
            const decoded = this._decodeToken(token);
            const roleCode = decoded?.roleCodes;
            return roleCode.split(', ');
        }
        else {
            return [];
        }
    }

    public getUserId(): number {
        const token = this.getAccessToken();
        if (token) {
            const decoded = this._decodeToken(token);
            return decoded?.nameid
        }
        else {
            return 0;
        }
    }

    public getUserName(): string {
        const token = this.getAccessToken();
        if (token) {
            const decoded = this._decodeToken(token);
            return decoded?.name
        }
        else {
            return AppUtil.EmptyString;
        }
    }

    public getUserEmail(): string {
        const token = this.getAccessToken();
        if (token) {
            const decoded = this._decodeToken(token);
            return decoded?.email
        }
        else {
            return AppUtil.EmptyString;
        }
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
        const payload = this._decodeToken(token);
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