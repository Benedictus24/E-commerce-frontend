import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/Authentication'; 
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <header class="header">
      <nav class="nav">
        <a routerLink="/" class="logo">Elite Ventures</a>
        
        <div class="burger" (click)="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul class="nav-links" [ngClass]="{ 'active': menuOpen }">
          <li><a routerLink="/">Home</a></li>
          <ng-container *ngIf="!isLoggedIn">
            <li><a routerLink="/categories">Our Range</a></li>
            <li><a routerLink="/register">Register</a></li>
            <li><a routerLink="/login">Login</a></li>
          </ng-container>
          <ng-container *ngIf="isLoggedIn">
          <li><a routerLink="/categories">Our Range</a></li>
          <li><a (click)="viewOrders()">View Orders</a></li>
            <li><button (click)="logout()" class="logout-btn">Logout</button></li>
          </ng-container>
          <li>
            <a routerLink="/cart" class="cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background-color: #F5F5F5;
      width: 100%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 1rem;
    }

    .logo {
      font-family: serif;
      font-size: 1.5rem;
      color: #333;
      text-decoration: none;
      border-bottom: 1px solid #333;
    }

    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      align-items: center;
    }

    .nav-links li {
      margin-left: 1.5rem;
    }

    .nav-links a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      font-size: 1rem;
      transition: color 0.3s ease;
    }

    .nav-links a:hover {
      color: #4a0e78;
    }

    .cart-icon {
      display: inline-flex;
      align-items: center;
    }

    .cart-icon svg {
      stroke: #333;
    }

    .logout-btn {
      background-color: transparent;
      border: none;
      color: #333;
      font-weight: 500;
      font-size: 1rem;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .logout-btn:hover {
      color: #4a0e78;
    }

    /* Hide menu on small screens and display burger menu */
    .burger {
      display: none;
      flex-direction: column;
      cursor: pointer;
      gap: 4px;
    }

    .burger span {
      height: 3px;
      width: 25px;
      background-color: #333;
    }

    /* Media Query for Mobile View */
    @media (max-width: 768px) {
      .nav-links {
        position: absolute;
        top: 60px;
        right: 0;
        background-color: #fff;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        justify-content: center;
        align-items: center;
        transform: translateX(100%);
        transition: transform 0.3s ease-in, background-color 0.3s ease-in;
      }

      .nav-links.active {
        transform: translateX(0);
        background-color: #F5F5F5;
      }

      .nav-links li {
        margin: 1.5rem 0;
      }

      .burger {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  isLoggedIn = false;
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
  }

  viewOrders() {
    const userId = localStorage.getItem('user_id'); // Get user ID from localStorage
    if (userId) {
      this.router.navigate([`/ViewOrders`, userId]); // Navigate to ViewOrders with the userId
    } else {
      Swal.fire({
        icon: 'error',
        title: 'User Not Logged In',
        text: 'There was an error retrieving your user information. Please log in again.',
        showConfirmButton: true
      }).then(() => {
        this.authService.logout();
        this.router.navigate(['/login']); // Redirect to login if user ID not found
      });
    }
  }
}
