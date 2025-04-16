import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { ServiceService, Service } from '../../../services/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];

  constructor(private router: Router, private serviceService: ServiceService) {}

  ngOnInit() {
    this.fetchServices();
  }

  // Fetch all services
  fetchServices() {
    this.serviceService.getServices().subscribe(
      (response) => {
        console.log('Fetched Services:', response); // Debugging
        this.services = response.data || response; // Adjust if API returns { data: [...] }
      },
      (error) => {
        console.error('Error fetching services:', error);
        Swal.fire('Error', 'Failed to fetch services. Please try again.', 'error');
      }
    );
  }

  // Navigate to add service page
  navigateToAddService() {
    this.router.navigate(['/dashboard/addservice']);
  }

  // Navigate to edit service page
  editService(service: Service) {
    this.router.navigate(['/dashboard/editservice', service.id]);
  }

  // Delete a service
  deleteService(service: Service) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the service: ${service.name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceService.deleteService(service.id).subscribe(
          () => {
            this.services = this.services.filter(s => s.id !== service.id); // Remove from UI
            Swal.fire('Deleted!', `${service.name} has been deleted.`, 'success');
          },
          (error) => {
            console.error('Error deleting service:', error);
            Swal.fire('Error', 'Failed to delete service. Please try again.', 'error');
          }
        );
      }
    });
  }
}
