import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetProductsResponse, Product } from '../types/product';
import { BehaviorSubject } from 'rxjs';
import { Cart, GetCartResponse } from '../types/cart';
import { MessageService } from './message.service';
import { ENVIRONMENT } from 'src/environment/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  baseUrl = ENVIRONMENT.baseUrl;

  private products$ = new BehaviorSubject<Product[]>([]);
  private cart$ = new BehaviorSubject<Cart>({
    discountedTotal: 0,
    id: 0,
    products: [],
    total: 0,
    totalProducts: 0,
    totalQuantity: 0,
    userId: 0,
  });
  private loading$ = new BehaviorSubject<boolean>(false);
  private productLoading$ = new BehaviorSubject<number | null>(null);

  get products() {
    return this.products$.asObservable();
  }

  get cart() {
    return this.cart$.asObservable();
  }

  get loading() {
    return this.loading$.asObservable();
  }

  get productLoading() {
    return this.productLoading$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
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
    const token = this.authService.getToken();
    const userId = this.authService.getUserId();

    if (token && userId) {
      this.loading$.next(true);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
      this.http
        .get<GetCartResponse>(`${this.baseUrl}/auth/carts/user/${userId}`, {
          headers,
        })
        .subscribe((response) => {
          this.cart$.next(response.carts[0]);
          this.loading$.next(false);
        });
    }
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
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http
      .put<Cart>(`${this.baseUrl}/auth/carts/${this.cart$.value.id}`, payload, {
        headers,
      })
      .subscribe((updatedCart) => {
        this.cart$.next(updatedCart);
        this.productLoading$.next(null);
        this.messageService.notify({
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

  getProductById(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }
}
