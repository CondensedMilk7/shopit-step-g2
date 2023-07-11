import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, tap } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent {
  private products$ = this.productsService.products;
  private loading$ = this.productsService.loading;
  private productLoading$ = this.productsService.productLoading;
  private message$ = this.messageService.message;

  private queryParams$ = this.route.queryParamMap.pipe(
    tap((paramMap) => {
      const search = paramMap.get('search');
      if (search) {
        this.productsService.searchProducts(search);
      } else {
        this.productsService.getProducts();
      }
    })
  );

  vm$ = combineLatest([
    this.products$,
    this.loading$,
    this.productLoading$,
    this.message$,
    this.queryParams$,
  ]).pipe(
    map((array) => {
      const [products, loading, productLoading, message, queryParams] = array;

      return {
        products,
        loading,
        productLoading,
        message,
        queryParams,
      };
    })
  );

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    public messageService: MessageService
  ) {}

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
}
