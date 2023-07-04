import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/types/product';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent implements OnInit, OnDestroy {
  products$ = this.productsService.products$;
  loading$ = this.productsService.loading$;
  productLoading$ = this.productsService.productLoading$;
  message$ = this.messageService.message$;

  destroyed$ = new Subject<void>();

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe((paramMap) => {
        const search = paramMap.get('search');
        if (search) {
          this.productsService.searchProducts(search);
        } else {
          this.productsService.getProducts();
        }
      });
  }

  onAddToCart(id: number) {
    this.productsService.addToCart(id);
  }

  onAdd() {
    this.productsService.addProduct({
      title: 'BMW pencil',
      description: 'The fastest and least safe pencil in the world!',
      brand: 'BMW',
      category: 'Fuel based pencils',
      discountPercentage: 20,
      id: 202,
      price: 100,
      thumbnail:
        'https://www.hubauer-shop.de/images/product_images/original_images/80242466198_A.png',
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
