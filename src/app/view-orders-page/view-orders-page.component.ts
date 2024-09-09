import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../Services/OrderService';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  orderItems: OrderItem[];
}

@Component({
  selector: 'app-view-orders-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-orders-page.component.html',
  styleUrls: ['./view-orders-page.component.css']
})
export class ViewOrdersPageComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  // Pagination properties
  currentPage = 1;
  pageSize = 3;
  totalPages = 0;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        this.loadOrders(parseInt(userId, 10));
      } else {
        this.error = 'User ID not provided';
      }
    });
  }

  loadOrders(userId: number) {
    this.loading = true;
    this.error = null;
  
    this.orderService.getOrdersByUser(userId).subscribe({
      next: (response: Order[]) => {
        this.orders = response;
        if (this.orders.length === 0) {
          this.error = 'You haven\'t placed any orders yet.';
        } else {
          this.totalPages = Math.ceil(this.orders.length / this.pageSize);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error = 'There are no orders to display.';
        this.loading = false;
      }
    });
  }

  get paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.orders.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}