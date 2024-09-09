import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AboutComponent } from './about/about.component';
import { ProductCategoriesPageComponent } from './product-categories-page/product-categories-page.component';
import { ProductItemPageComponent } from './product-item-page/product-item-page.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { ViewOrdersPageComponent } from './view-orders-page/view-orders-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
export const routes: Routes = [
    { path: '', component: LandingPageComponent },  
    { path: 'home', component: LandingPageComponent },  
    { path: 'register', component: RegisterPageComponent },  
    { path: 'login', component: LoginPageComponent },  
    { path: 'about', component: AboutComponent},  
    { path: 'categories', component: ProductCategoriesPageComponent },
    { path: 'items/:categoryId', component: ProductItemPageComponent },  
    { path: 'cart', component: CartPageComponent },  
    { path: 'ViewOrders/:userId', component: ViewOrdersPageComponent },
    {path:'resetPassword',component:ResetPasswordComponent}

];