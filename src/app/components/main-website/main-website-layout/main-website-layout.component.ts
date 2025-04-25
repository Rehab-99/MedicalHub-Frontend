import { Component, ViewEncapsulation, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../../services/doctor.service';
import { environment } from '../../../../environments/environment';

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
  currentSlide = 1;
  private slideInterval: any;
  private imagesLoaded = false;
  feedbacks: any[] = [];
  latestDoctors: any[] = [];
  baseUrl = environment.apiUrl;

  private images = [
    'https://images.ctfassets.net/szez98lehkfm/3aFXjISnNZfF0MkUX6Z5rZ/af19d4cd2183c340fde85ef620db9d81/MyIC_Inline_79497',
    'https://img.freepik.com/free-photo/close-up-veterinarian-taking-care-pet_23-2149143884.jpg'
  ];

  constructor(private http: HttpClient, private doctorService: DoctorService) {}

  ngOnInit() {
    this.preloadImages().then(() => {
      this.imagesLoaded = true;
      this.startAutoSlide();
    });

    this.loadLatestDoctors();

    this.http.get(`${environment.apiUrl}/feedback`).subscribe({
      next: (res: any) => {
        this.feedbacks = res?.data?.data || [];
        console.log('Feedbacks loaded:', this.feedbacks);
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
        this.feedbacks = [];
      }
    });
  }

  private preloadImages(): Promise<void> {
    const promises = this.images.map((image) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = () => resolve();
        img.onerror = () => {
          console.error(`Failed to preload image: ${image}`);
          resolve();
        };
      });
    });
    return Promise.all(promises).then(() => {});
  }

  loadLatestDoctors() {
    this.doctorService.getLatestDoctors(4).subscribe({
      next: (response) => {
        this.latestDoctors = response.data || response;
        console.log('Latest doctors loaded:', this.latestDoctors);
        this.latestDoctors.forEach(doctor => {
          console.log('Doctor:', doctor.name, 'Image Path:', doctor.image, 'URL:', this.getImageUrl(doctor.image));
        });
      },
      error: (error) => {
        console.error('Error loading latest doctors:', error);
        this.latestDoctors = [];
      }
    });
  }

  ngOnDestroy() {
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
    if (!this.imagesLoaded) return;
    this.currentSlide = slide;
    this.resetAutoSlide();
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      console.log('No image path provided for doctor, using placeholder');
      return 'https://via.placeholder.com/100';
    }
    if (imagePath.startsWith('http')) {
      console.log('Full image URL:', imagePath);
      return imagePath;
    }
    const storageUrl = this.baseUrl.replace('/api', '');
    const fullUrl = `${storageUrl}/storage/${imagePath}`;
    console.log('Constructed image URL:', fullUrl);
    return fullUrl;
  }

  private startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = this.currentSlide === 1 ? 2 : 1;
    }, 10000);
  }

  private resetAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startAutoSlide();
  }
}