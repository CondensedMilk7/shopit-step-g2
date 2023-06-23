import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/types/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  destroyed$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe((paramMap) => {
        const productId = Number(paramMap.get('productId'));
        if (productId && !isNaN(productId)) {
          this.product = this.productsService.getProductById(productId) || null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
