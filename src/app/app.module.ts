// This file is kept for legacy reasons but is not used.
// The application now uses standalone components with bootstrapApplication in main.ts
// and configuration in app.config.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { AppComponent } from './app.component';
import { BookComponent } from './components/main-website/services/book/book.component';

@NgModule({
  declarations: [
    AppComponent,
    BookComponent  // Declare the BookComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,  // Add ReactiveFormsModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }