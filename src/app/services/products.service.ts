import { Injectable } from '@angular/core';
import { PRODUCTS } from '../data';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GetProductsResponse, Product } from '../types/product';
import { BehaviorSubject } from 'rxjs';
import { Cart, GetCartResponse } from '../types/cart';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  baseUrl = 'https://dummyjson.com';
  products$ = new BehaviorSubject<Product[]>([]);
  cart$ = new BehaviorSubject<Cart>({
    discountedTotal: 0,
    id: 0,
    products: [],
    total: 0,
    totalProducts: 0,
    totalQuantity: 0,
    userId: 0,
  });
  loading$ = new BehaviorSubject<boolean>(false);
  productLoading$ = new BehaviorSubject<number | null>(null);

  private products = PRODUCTS;
  private cartProducts = PRODUCTS.splice(0, 2);

  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getProducts() {
    this.loading$.next(true);
    this.http
      .get<GetProductsResponse>(`${this.baseUrl}/products`)
      .subscribe((response) => {
        this.products$.next(response.products);
        this.loading$.next(false);
      });
  }

  searchProducts(query: string) {
    this.loading$.next(true);
    this.http
      .get<GetProductsResponse>(`${this.baseUrl}/products/search`, {
        params: { q: query },
      })
      .subscribe((response) => {
        this.products$.next(response.products);
        this.loading$.next(false);
      });
  }

  getCart() {
    this.loading$.next(true);
    this.http
      .get<GetCartResponse>(`${this.baseUrl}/carts/user/5`)
      .subscribe((response) => {
        this.cart$.next(response.carts[0]);
        this.loading$.next(false);
      });
  }

  deleteFromCart(cartId: number, toDeleteId: number) {
    const products = this.cart$.value.products;
    const filteredProducts = products.filter((prod) => prod.id !== toDeleteId);
    this.productLoading$.next(toDeleteId);

    const payload = {
      merge: false,
      products: filteredProducts,
    };

    this.http
      .put<Cart>(`${this.baseUrl}/carts/${cartId}`, payload)
      .subscribe((updatedCart) => {
        this.cart$.next(updatedCart);
        this.productLoading$.next(null);
      });
  }

  addToCart(productId: number, quantity: number = 1) {
    this.productLoading$.next(productId);

    const payload = {
      merge: true,
      products: [{ id: productId, quantity }],
    };

    this.http
      .put<Cart>(`${this.baseUrl}/carts/${this.cart$.value.id}`, payload)
      .subscribe((updatedCart) => {
        this.cart$.next(updatedCart);
        this.productLoading$.next(null);
        this.messageService.message({
          title: 'Product Added!',
          description: 'Your product has been added to cart!',
        });
      });
  }

  addProduct(product: Partial<Product>) {
    this.loading$.next(true);

    this.http
      .post<Product>(`${this.baseUrl}/products/add`, product)
      .subscribe((newProduct) => {
        const products = this.products$.value;
        products.unshift(newProduct);
        this.products$.next(products);
        this.loading$.next(false);
      });
  }

  getRecommendedProduct() {
    const randomIndex = Math.floor(Math.random() * this.products.length);
    return [this.products[randomIndex]];
  }

  getProductById(id: number) {
    return this.products.find((p) => p.id === id);
  }
}
