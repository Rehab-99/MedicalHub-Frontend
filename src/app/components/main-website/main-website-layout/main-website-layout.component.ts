import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-website-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './main-website-layout.component.html',
  styleUrl: './main-website-layout.component.css'
})
export class MainWebsiteLayoutComponent {}
