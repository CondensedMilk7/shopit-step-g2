import { Component, OnInit } from '@angular/core';
import { PRODUCTS } from './data';
import { PageType } from './types/page-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  productsFilterText = '';
  isDark = false;
  currentPage: PageType = 'shop';

  ngOnInit() {
    const wasDark = localStorage.getItem('is_dark');
    if (wasDark === 'true') {
      this.isDark = true;
    }
  }

  onToggleDark(isDark: boolean) {
    this.isDark = isDark;
    localStorage.setItem('is_dark', isDark.toString());
  }

  onSearchProduct(text: string) {
    this.productsFilterText = text;
  }

  onNavigate(page: PageType) {
    this.currentPage = page;
  }
}
