import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  description: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'moyo_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const cartData = localStorage.getItem(this.cartKey);
    if (cartData) {
      this.cartSubject.next(JSON.parse(cartData));
    }
  }

  private saveCart(cart: CartItem[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  getCart() {
    return this.cartSubject.asObservable();
  }

  addToCart(product: CartItem) {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.productId === product.productId);

    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      currentCart.push(product);
    }

    this.saveCart(currentCart);
  }

  removeFromCart(productId: number) {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => item.productId !== productId);
    this.saveCart(updatedCart);
  }

  clearCart() {
    this.saveCart([]);
  }

  updateQuantity(productId: number, change: number) {
    const currentCart = this.cartSubject.value;
    const item = currentCart.find(i => i.productId === productId);

    if (item) {
      item.quantity += change;
      
      // Ensure quantity doesn't go below 1
      if (item.quantity < 1) {
        item.quantity = 1;
      }
      
      this.saveCart(currentCart);
    }
  }
}
