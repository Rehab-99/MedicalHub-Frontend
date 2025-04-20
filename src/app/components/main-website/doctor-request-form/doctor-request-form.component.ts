import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DoctorRequestService } from '../../../services/doctor-request.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-request-form',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-request-form.component.html',
  styleUrls: ['./doctor-request-form.component.css'],
})
export class DoctorRequestFormComponent {
  doctorRequestForm: FormGroup;
  cardImageFile: File | null = null;
  certificatePdfFile: File | null = null;
  maxFileSizeImage = 2 * 1024 * 1024; // 2MB
  maxFileSizePdf = 5 * 1024 * 1024; // 5MB

  constructor(
    private fb: FormBuilder,
    private doctorRequestService: DoctorRequestService
  ) {
    this.doctorRequestForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^\+?\d{10,20}$/)]],
      specialization: ['', [Validators.required, Validators.maxLength(255)]],
      card_image: [null, [Validators.required, this.validateFileType(['image/jpeg', 'image/png', 'image/jpg']), this.validateFileSize(this.maxFileSizeImage)]],
      certificate_pdf: [null, [Validators.required, this.validateFileType(['application/pdf']), this.validateFileSize(this.maxFileSizePdf)]],
      notes: ['', [Validators.maxLength(1000)]],
    });
  }

  private validateFileType(allowedTypes: string[]) {
    return (control: any) => {
      const file = control.value;
      if (!file) return null;
      if (!(file instanceof File)) return { invalidFile: true };
      if (!allowedTypes.includes(file.type)) {
        return { invalidFileType: true };
      }
      return null;
    };
  }

  private validateFileSize(maxSize: number) {
    return (control: any) => {
      const file = control.value;
      if (!file) return null;
      if (!(file instanceof File)) return { invalidFile: true };
      if (file.size > maxSize) {
        return { fileTooLarge: true };
      }
      return null;
    };
  }

  onCardImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.cardImageFile = file;
      this.doctorRequestForm.patchValue({ card_image: file });
      this.doctorRequestForm.get('card_image')?.updateValueAndValidity();
    } else {
      this.cardImageFile = null;
      this.doctorRequestForm.patchValue({ card_image: null });
      this.doctorRequestForm.get('card_image')?.updateValueAndValidity();
    }
  }

  onCertificatePdfChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.certificatePdfFile = file;
      this.doctorRequestForm.patchValue({ certificate_pdf: file });
      this.doctorRequestForm.get('certificate_pdf')?.updateValueAndValidity();
    } else {
      this.certificatePdfFile = null;
      this.doctorRequestForm.patchValue({ certificate_pdf: null });
      this.doctorRequestForm.get('certificate_pdf')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    console.log('Form submitted', this.doctorRequestForm.value);
    console.log('Files:', this.cardImageFile, this.certificatePdfFile);

    this.doctorRequestForm.markAllAsTouched();

    if (this.doctorRequestForm.invalid) {
      console.log('Form invalid', this.doctorRequestForm.errors);
      Swal.fire({
        icon: 'error',
        title: 'Form Invalid',
        text: 'Please fill all required fields correctly and ensure files are valid.',
      });
      return;
    }

    if (!this.cardImageFile || !this.certificatePdfFile) {
      Swal.fire({
        icon: 'error',
        title: 'Files Missing',
        text: 'Please upload both card image and certificate PDF.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('full_name', this.doctorRequestForm.value.full_name);
    formData.append('email', this.doctorRequestForm.value.email);
    formData.append('phone', this.doctorRequestForm.value.phone);
    formData.append('specialization', this.doctorRequestForm.value.specialization);
    formData.append('notes', this.doctorRequestForm.value.notes || '');
    formData.append('card_image', this.cardImageFile, this.cardImageFile.name);
    formData.append('certificate_pdf', this.certificatePdfFile, this.certificatePdfFile.name);

    console.log('FormData contents:');
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    this.doctorRequestService.submitDoctorRequest(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Doctor request submitted successfully!',
        });
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Full error response:', error);
        let errorMessage = 'An error occurred while submitting the form.';

        if (error.error?.errors) {
          // Explicitly type the errors object
          const errors: { [key: string]: string[] } = error.error.errors;
          errorMessage = Object.entries(errors)
            .map(([field, messages]: [string, string[]]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          html: `<pre style="text-align: left; white-space: pre-wrap;">${errorMessage}</pre>`,
          scrollbarPadding: false,
        });
      },
    });
  }

  private resetForm() {
    this.doctorRequestForm.reset();
    this.cardImageFile = null;
    this.certificatePdfFile = null;
    Object.keys(this.doctorRequestForm.controls).forEach(key => {
      this.doctorRequestForm.get(key)?.setErrors(null);
      this.doctorRequestForm.get(key)?.markAsUntouched();
      this.doctorRequestForm.get(key)?.markAsPristine();
    });
    const cardImageInput = document.getElementById('card_image') as HTMLInputElement;
    const certificatePdfInput = document.getElementById('certificate_pdf') as HTMLInputElement;
    if (cardImageInput) cardImageInput.value = '';
    if (certificatePdfInput) certificatePdfInput.value = '';
  }
}