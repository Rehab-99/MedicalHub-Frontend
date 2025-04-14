import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule,HeaderComponent],
})
export class ServiceListComponent implements OnInit {
  services: any[] = [];

  constructor(private serviceService: ServiceService ) {}

  ngOnInit(): void {
    this.serviceService.getServices().subscribe({
      next: (data) => {
        console.log('Services:', data);
        this.services = data;
      },
      error: (error) => {
        console.error('Error fetching services:', error);
      }
    });
  }
}
