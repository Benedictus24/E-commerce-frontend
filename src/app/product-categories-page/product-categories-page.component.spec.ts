import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoriesPageComponent } from './product-categories-page.component';

describe('ProductCategoriesPageComponent', () => {
  let component: ProductCategoriesPageComponent;
  let fixture: ComponentFixture<ProductCategoriesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoriesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
