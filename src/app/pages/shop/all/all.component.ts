import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/types/product';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filterText = '';
  destroyed$ = new Subject<void>();

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.products = this.productsService.getProducts();

    this.route.queryParamMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe((paramMap) => {
        const search = paramMap.get('search');
        this.filterText = search || '';
      });
  }

  onAddToCart(id: number) {
    this.productsService.addToCart(id);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
