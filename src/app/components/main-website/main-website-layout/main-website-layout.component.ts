import { Component, ViewEncapsulation, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-website-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './main-website-layout.component.html',
  styleUrls: ['./main-website-layout.component.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'main-website-layout',
    style: 'display: block; height: 100%; overflow-y: auto;'
  }
})
export class MainWebsiteLayoutComponent implements OnInit, OnDestroy {
  isScrollButtonVisible = false;
  currentSlide = 1; // 1 for Human, 2 for Vet
  private slideInterval: any;
  private imagesLoaded = false;

  // Preload images
  private images = [
    'https://images.ctfassets.net/szez98lehkfm/3aFXjISnNZfF0MkUX6Z5rZ/af19d4cd2183c340fde85ef620db9d81/MyIC_Inline_79497',
    'https://th.bing.com/th/id/https://img.freepik.com/free-photo/close-up-veterinarian-taking-care-pet_23-2149143884.jpg?t=st=1745327603~exp=1745331203~hmac=a707bc5baa1ba74fb8f38c35a885e2f49149f037e3a037302974d05a0f471757&w=996.nU3o0Lpjewx98yAtl0CFpgHaKP?rs=1&pid=ImgDetMain',
  ];

  ngOnInit() {
    // Preload images and start auto-slide after they're loaded
    this.preloadImages().then(() => {
      this.imagesLoaded = true;
      this.startAutoSlide();
    });
  }

  ngOnDestroy() {
    // Clean up interval on component destroy
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

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

  setSlide(slide: number) {
    if (!this.imagesLoaded) return; // Prevent slide change until images are loaded
    this.currentSlide = slide;
    // Reset auto-slide timer after manual interaction
    this.resetAutoSlide();
  }

  private preloadImages(): Promise<void> {
    const promises = this.images.map(src => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even if image fails to load
      });
    });
    return Promise.all(promises).then(() => {});
  }

  private startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = this.currentSlide === 1 ? 2 : 1;
    }, 10000); // 10 seconds per slide
  }

  private resetAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startAutoSlide();
  }
}