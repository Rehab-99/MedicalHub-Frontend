import { Component, ViewEncapsulation, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../../services/doctor.service';
import { AuthService } from '../../../services/auth.service';
import { ClinicService } from '../../../services/clinic.service';
import { VetService } from '../../../services/vet.service';
import { ServiceService } from '../../../services/service.service';
import { AppointmentService } from '../../../services/appointment.service';
import { environment } from '../../../../environments/environment';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-main-website-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, ChatComponent],
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
  totalDoctors: number = 0;
  totalUsers: number = 0;
  totalClinics: number = 0;
  totalAppointments: number = 0;
  baseUrl = environment.apiUrl;

  private images = [
    'https://images.ctfassets.net/szez98lehkfm/3aFXjISnNZfF0MkUX6Z5rZ/af19d4cd2183c340fde85ef620db9d81/MyIC_Inline_79497',
    'https://img.freepik.com/free-photo/close-up-veterinarian-taking-care-pet_23-2149143884.jpg'
  ];

  constructor(
    private http: HttpClient, 
    private doctorService: DoctorService,
    private authService: AuthService,
    private clinicService: ClinicService,
    private vetService: VetService,
    private serviceService: ServiceService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.preloadImages().then(() => {
      this.imagesLoaded = true;
      this.startAutoSlide();
    });

    this.loadLatestDoctors();
    this.loadTotalDoctors();
    this.loadTotalUsers();
    this.loadTotalClinics();
    this.loadTotalAppointments();

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
      next: (response: any) => {
        this.latestDoctors = response.data || [];
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

  loadTotalDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (response: any) => {
        this.totalDoctors = response.data?.length || 0;
      },
      error: (error) => {
        console.error('Error loading total doctors:', error);
      }
    });
  }

  loadTotalUsers() {
    const token = this.authService.getToken();
    if (token) {
      this.http.get(`${environment.apiUrl}/user/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: (response: any) => {
          this.totalUsers = response.users?.length || 0;
        },
        error: (error) => {
          console.error('Error loading total users:', error);
        }
      });
    }
  }

  loadTotalClinics() {
    // Load human clinics
    this.clinicService.getClinics().subscribe({
      next: (response: any) => {
        const humanClinics = response.data?.length || 0;
        
        // Load vet clinics
        this.vetService.getVetClinics().subscribe({
          next: (vetResponse: any) => {
            const vetClinics = vetResponse.data?.length || 0;
            this.totalClinics = humanClinics + vetClinics;
          },
          error: (error) => {
            console.error('Error loading vet clinics:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error loading human clinics:', error);
      }
    });
  }

  loadTotalAppointments() {
    this.appointmentService.getAllAppointments().subscribe({
      next: (response: any) => {
        this.totalAppointments = response?.length || 0;
      },
      error: (error) => {
        console.error('Error loading total appointments:', error);
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