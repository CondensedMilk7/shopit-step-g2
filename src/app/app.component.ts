import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from './services/products.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isDark = false;
  searchText = '';
  user$ = this.authService.user;

  destroyed$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const wasDark = localStorage.getItem('is_dark');
    if (wasDark === 'true') {
      this.isDark = true;
    }

    this.authService.init();

    this.productsService.getCart();

    this.route.queryParamMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe((paramMap) => {
        this.searchText = paramMap.get('search') || '';
      });
  }

  onToggleDark(isDark: boolean) {
    this.isDark = isDark;
    localStorage.setItem('is_dark', isDark.toString());
  }

  onSearchProduct(text: string) {
    this.router.navigate(['shop'], {
      queryParams: {
        search: text,
      },
    });
  }

  onSignOut() {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
