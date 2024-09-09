import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Category {
  categoryID: number;
  categoryDescription: string;
}

@Component({
  selector: 'app-product-categories-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Explore our Stylish Categories</h2>
    <div class="categories-container">
      <div *ngFor="let category of categories" class="category-tab" (click)="selectCategory(category.categoryID)">
        <h3>{{ category.categoryDescription }}</h3>
      </div>
    </div>
  `,
  styleUrls: ['./product-categories-page.component.css']
})
export class ProductCategoriesPageComponent implements OnInit {
  
  categories: Category[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.http.get<Category[]>('https://localhost:7089/api/ProductCategory/GetAllCategories')
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      });
  }

  selectCategory(categoryId: number) {
    this.router.navigate(['/items', categoryId]);
  }
}