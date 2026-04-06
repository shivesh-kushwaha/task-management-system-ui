import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private requestCount = 0;
    private _loading = new BehaviorSubject<boolean>(false);
    
    loading$ = this._loading.asObservable();

    show(): void {
        this.requestCount++;
        console.log('Show - Count:', this.requestCount);
        if (this.requestCount === 1) {
            this._loading.next(true);
        }
    }

    hide(): void {
        // CRITICAL: Only decrement if count > 0
        if (this.requestCount > 0) {
            this.requestCount--;
        } else {
            console.warn('Hide called when count is already 0!');
            return; // Don't emit anything if already at 0
        }
        
        console.log('Hide - Count:', this.requestCount);
        
        if (this.requestCount === 0) {
            this._loading.next(false);
        }
    }
}