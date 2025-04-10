import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = null;
  isLoading = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.minLength(6)]],
      password_confirmation: [''],
      address: ['', [Validators.maxLength(255)]],
      phone: ['', [Validators.maxLength(20)]],
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone
        });
        this.imagePreview = user.image;
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { 'mismatch': true };
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.showError = false;
      this.showSuccess = false;

      const formData = new FormData();
      Object.keys(this.profileForm.value).forEach(key => {
        if (this.profileForm.value[key]) {
          formData.append(key, this.profileForm.value[key]);
        }
      });

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      // Get token from AuthService
      const token = this.authService.getToken();
      
      // Create headers with token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.post(`${environment.apiUrl}/user/update`, formData, { headers }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.showSuccess = true;
          this.authService.setUser(response.user);
          this.imagePreview = response.user.image;
          this.selectedImage = null;
        },
        error: (error) => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.error.message || 'حدث خطأ أثناء تحديث الملف الشخصي.';
        }
      });
    }
  }

  get name() { return this.profileForm.get('name'); }
  get email() { return this.profileForm.get('email'); }
  get password() { return this.profileForm.get('password'); }
  get password_confirmation() { return this.profileForm.get('password_confirmation'); }
  get address() { return this.profileForm.get('address'); }
  get phone() { return this.profileForm.get('phone'); }
} 