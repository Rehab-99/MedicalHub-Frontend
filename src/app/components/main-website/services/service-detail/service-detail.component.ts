import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService, Service } from '../../../../services/service.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  services: any[] = [];
  selectedService: any = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.http.get('http://127.0.0.1:8000/api/services').subscribe({
      next: (data: any) => {
        this.services = data;
        if (data.length > 0) {
          this.selectedService = data[0];
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load services';
        this.toastr.error('Failed to load services');
        this.loading = false;
      }
    });
  }

  selectService(service: any): void {
    this.selectedService = service;
  }
}
