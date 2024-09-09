import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../Services/CartService';
import Swal from 'sweetalert2';


interface ProductItem {
  productId: number;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-product-item-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-item-page.component.html',
  styleUrls: ['./product-item-page.component.css']
})
export class ProductItemPageComponent implements OnInit {
  productItems: ProductItem[] = [];
  loading = false;
  error: string | null = null;
  quantitySelections: { [productId: number]: number } = {};

  constructor(private http: HttpClient, private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('categoryId');
      if (categoryId) {
        this.loadProducts(+categoryId);
      }
    });
  }

  loadProducts(categoryId: number) {
    console.log('Loading products for category:', categoryId);
    this.loading = true;
    this.error = null;
    this.http.get<ProductItem[]>(`https://localhost:7089/api/ProductItem/GetAllItems?categoryId=${categoryId}`)
      .subscribe({
        next: (data) => {
          console.log('Received products:', data);
          this.productItems = data;
          this.initializeQuantitySelections();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.error = 'Failed to load products. Please try again.';
          this.loading = false;
        }
      });
  }

  initializeQuantitySelections() {
    this.productItems.forEach(product => {
      this.quantitySelections[product.productId] = 1;
    });
  }

  addToCart(product: ProductItem) {
    const quantity = this.quantitySelections[product.productId];
    if (quantity > 0 && quantity <= product.quantity) {
      this.cartService.addToCart({
        ...product,
        quantity: quantity
      });
      Swal.fire({
        title: 'Item added to cart!',
        text: `${quantity} ${product.description}(s) have been added to your cart.`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Proceed to Cart',
        cancelButtonText: 'Continue Shopping',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to the cart page or handle proceeding to cart
          window.location.href = '/cart';  // Adjust this path based on your routing setup
        }
      });
    } else {
      Swal.fire({
        title: 'Invalid quantity',
        text: 'Please select a valid quantity.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  incrementQuantity(productId: number) {
    if (this.quantitySelections[productId] < this.productItems.find(p => p.productId === productId)!.quantity) {
      this.quantitySelections[productId]++;
    }
  }

  decrementQuantity(productId: number) {
    if (this.quantitySelections[productId] > 1) {
      this.quantitySelections[productId]--;
    }
  }
}