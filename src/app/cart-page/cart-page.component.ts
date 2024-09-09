import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../Services/CartService';
import { OrderService } from '../Services/OrderService';
import { AuthService } from '../Services/Authentication';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
  }

  removeItem(productId: number) {
    Swal.fire({
      title: 'Remove Item',
      text: 'Are you sure you want to remove this item from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(productId);
        Swal.fire(
          'Removed!',
          'The item has been removed from your cart.',
          'success'
        );
      }
    });
  }

  clearCart() {
    Swal.fire({
      title: 'Clear Cart',
      text: 'Are you sure you want to clear your entire cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        Swal.fire(
          'Cleared!',
          'Your cart has been cleared.',
          'success'
        );
      }
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  checkout() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        Swal.fire({
          icon: 'warning',
          title: 'Not Logged In',
          text: 'Please log in to order.',
          showCancelButton: true,
          confirmButtonText: 'Log in',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
        return;
      }

      if (this.cartItems.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Empty Cart',
          text: 'Your cart is empty. Please add items before checking out.',
          showConfirmButton: true
        });
        return;
      }

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        Swal.fire({
          icon: 'error',
          title: 'User Not Logged In',
          text: 'There was an error retrieving your user information. Please try logging in again.',
          showConfirmButton: true
        }).then(() => {
          this.authService.logout();
        });
        return;
      }

      const orderData = {
        userId: parseInt(userId, 10),
        statusId: 1, // Order Status of ordered
        items: this.cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      this.orderService.addOrder(orderData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Order Placed',
            text: `Your order has been placed successfully! Order ID: ${response.orderId}`,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            this.cartService.clearCart();
            this.router.navigate(['/ViewOrders', orderData.userId]);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Order Failed',
            text: 'There was an error placing your order. Please try again or contact support.',
            showConfirmButton: true
          });
          console.error('Order error', error);
        }
      });
    });
  }

  increaseQuantity(productId: number) {
    this.cartService.updateQuantity(productId, 1);
  }

  decreaseQuantity(productId: number) {
    this.cartService.updateQuantity(productId, -1);
  }
}
