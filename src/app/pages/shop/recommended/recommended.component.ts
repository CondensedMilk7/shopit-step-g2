import { Component, OnInit } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss'],
})
export class RecommendedComponent implements OnInit {
  private products$ = this.productsService.products;
  private loading$ = this.productsService.loading;
  private productLoading$ = this.productsService.productLoading;

  vm$ = combineLatest([
    this.products$,
    this.loading$,
    this.productLoading$,
  ]).pipe(
    map(([products, loading, productLoading]) => ({
      products,
      loading,
      productLoading,
    }))
  );

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {}

  onAddToCart(id: number) {
    this.productsService.addToCart(id);
  }
}
