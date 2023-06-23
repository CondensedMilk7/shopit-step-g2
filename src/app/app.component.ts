import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isDark = false;
  searchText = '';
  destroyed$ = new Subject<void>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const wasDark = localStorage.getItem('is_dark');
    if (wasDark === 'true') {
      this.isDark = true;
    }

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

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
