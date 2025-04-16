// This file is kept for legacy reasons but is not used.
// The application now uses standalone components with bootstrapApplication in main.ts
// and configuration in app.config.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { AppComponent } from './app.component';
import { BookComponent } from './components/main-website/services/book/book.component';
import { AddservicesComponent } from './components/dashboard/addservices/addservices.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    BookComponent ,
    AddservicesComponent // Declare the BookComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,  // Add ReactiveFormsModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }