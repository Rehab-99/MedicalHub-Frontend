import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-website-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './main-website-layout.component.html',
  styleUrls: ['./main-website-layout.component.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'main-website-layout',
    style: 'display: block; height: 100%; overflow-y: auto;'
  }
})
export class MainWebsiteLayoutComponent {
  isScrollButtonVisible = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrollButtonVisible = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
