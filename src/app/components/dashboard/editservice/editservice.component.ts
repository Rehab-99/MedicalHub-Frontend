import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ServiceService, Service } from '../../../services/service.service';
import { ReactiveFormsModule } from '@angular/forms';  // <-- Import ReactiveFormsModule

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // <-- Include ReactiveFormsModule here
  templateUrl: './editservice.component.html',
  styleUrls: ['./editservice.component.css']
})
export class EditServiceComponent implements OnInit {
  serviceForm!: FormGroup;  // Use the '!' operator to indicate the form will be assigned later
  serviceId: number | null = null;
  service: Service | null = null;

  constructor(
    private router: Router,
    private serviceService: ServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Initialize form in ngOnInit
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      price: [''],
      duration: [''],
      is_active: [''],
      instructions: [''],
      image: [null]  // Placeholder for image input
    });

    // Get the service ID from the route
    this.serviceId = +this.router.url.split('/').pop()!; // Or use ActivatedRoute to get the ID

    if (this.serviceId) {
      // Fetch service data by ID
      this.serviceService.getServiceById(this.serviceId).subscribe((response) => {
        this.service = response;  // Corrected to response directly
        this.initializeForm();
      });
    }
  }

  // Initialize form with service data
  initializeForm() {
    if (this.service) {
      this.serviceForm.patchValue({
        name: this.service.name,
        description: this.service.description,
        price: this.service.price,
        duration: this.service.duration,
        is_active: this.service.is_active,
        instructions: this.service.instructions,
        image: null  // Keep image as null until a new one is selected
      });
    }
  }

  // Submit the form
  onSubmit() {
    if (this.serviceForm.valid) {
      const formData = new FormData();
      
      // Append all form data to FormData object
      Object.keys(this.serviceForm.controls).forEach((key) => {
        const control = this.serviceForm.get(key);
        if (control?.value) {
          formData.append(key, control.value);
        }
      });
  
      // Call the service method to update the service
      if (this.serviceId) {
        this.serviceService.updateService(this.serviceId, formData).subscribe(
          (response) => {
            Swal.fire('Success', 'Service updated successfully!', 'success');
            this.router.navigate(['/dashboard/services']);  // Redirect after update
          },
          (error) => {
            Swal.fire('Error', 'Failed to update service.', 'error');
            console.error(error);
          }
        );
      }
    }
  }
  
}  