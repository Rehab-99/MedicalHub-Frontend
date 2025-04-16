import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-addservices',
  standalone: true,
  imports: [ReactiveFormsModule],  // Import ReactiveFormsModule for standalone components
  templateUrl: './addservices.component.html',
  styleUrls: ['./addservices.component.css']
})
export class AddservicesComponent {
  serviceForm: FormGroup;
  imageFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder, 
    private serviceService: ServiceService,
    private router: Router
  ) {
    this.serviceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      description: [''],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      duration: ['', [Validators.required, Validators.min(1)]],
      instructions: [''],
      is_active: [true],
      image: [null]
    });
  }

  ngOnInit() {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  onSubmit() {
    if (this.serviceForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.serviceForm.value.name);
    formData.append('description', this.serviceForm.value.description);
    formData.append('price', this.serviceForm.value.price);
    formData.append('duration', this.serviceForm.value.duration);
    formData.append('instructions', this.serviceForm.value.instructions);
    formData.append('is_active', this.serviceForm.value.is_active ? '1' : '0');

    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    }

    this.serviceService.addService(formData).subscribe(
      (response) => {
        Swal.fire('Success!', 'Service has been added successfully!', 'success');
        this.router.navigate(['/dashboard/services']);
      },
      (error) => {
        console.error('Error adding service:', error);
        Swal.fire('Error', 'Failed to add the service. Please try again.', 'error');
      }
    );
  }
}
