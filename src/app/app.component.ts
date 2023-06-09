import { Component, OnInit } from '@angular/core';
import { PRODUCTS } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  productsFilterText = '';
  isDark = false;
  products = PRODUCTS;

  ngOnInit() {
    const wasDark = localStorage.getItem('is_dark');
    if (wasDark === 'true') {
      this.isDark = true;
    }
  }

  onDeleteProduct(id: number) {
    this.products = this.products.filter((product) => product.id !== id);
  }

  onToggleDark(isDark: boolean) {
    this.isDark = isDark;
    localStorage.setItem('is_dark', isDark.toString());
  }

  onSearchProduct(text: string) {
    this.productsFilterText = text;
  }
}
