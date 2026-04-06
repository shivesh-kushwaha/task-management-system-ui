import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subscription: Subscription | null = null;

  constructor(
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscription = this.loadingService.loading$.subscribe(isLoading => {
      // Use setTimeout to break the change detection cycle
      setTimeout(() => {
        this.isLoading = isLoading;
        this.cdr.detectChanges();
      }, 0);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}