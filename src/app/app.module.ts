import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common'; // أضفنا CommonModule
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common'; // استيراد DatePipe

import { AppComponent } from './app.component';
import { UserLoginComponent } from './components/auth/user-login/user-login.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MainWebsiteLayoutComponent } from './components/main-website/main-website-layout/main-website-layout.component';
import { routes } from './app.routes';
import { VetBlogListComponent } from './components/main-website/blog/vet/vet-blog-list/vet-blog-list.component';
import { VetBlogAddComponent } from './components/main-website/blog/vet/vet-blog-add/vet-blog-add.component';
import { VetBlogDetailComponent } from './components/main-website/blog/vet/vet-blog-detail/vet-blog-detail.component';
import { HeaderComponent } from './components/dashboard/header/header.component';
import { FooterComponent } from './components/main-website/footer/footer.component';
import { CommentsComponent } from './components/main-website/blog/comments/comments.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    ResetPasswordComponent,
    RegisterComponent,
    MainWebsiteLayoutComponent,
    VetBlogListComponent,
    VetBlogAddComponent,
    VetBlogDetailComponent,
    HeaderComponent,
    FooterComponent,
    CommentsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
     FormsModule,
     ToastrModule.forRoot(),
    CommonModule, // أضفنا CommonModule هنا
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }