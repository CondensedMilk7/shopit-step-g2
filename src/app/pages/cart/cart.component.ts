import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/types/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.products = this.productsService.getCart();
  }

  onDelete(id: number) {
    this.productsService.deleteFromCart(id);
    this.products = this.productsService.getCart();
  }
}
