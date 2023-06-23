import { Injectable } from '@angular/core';
import { PRODUCTS } from '../data';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products = PRODUCTS;
  private cartProducts = PRODUCTS.splice(0, 2);

  constructor(private router: Router) {}

  getProducts() {
    return this.products;
  }

  getCart() {
    return this.cartProducts;
  }

  deleteFromCart(id: number) {
    this.cartProducts = this.cartProducts.filter((p) => p.id !== id);
  }

  addToCart(id: number) {
    const productToAdd = this.products.find((p) => p.id === id);

    if (productToAdd) {
      this.cartProducts.unshift(productToAdd);
      this.router.navigate(['cart']);
    } else {
      throw new Error(`Could not add product to cart. ID: ${id}`);
    }
  }

  getRecommendedProduct() {
    const randomIndex = Math.floor(Math.random() * this.products.length);
    return [this.products[randomIndex]];
  }

  getProductById(id: number) {
    return this.products.find((p) => p.id === id);
  }
}
