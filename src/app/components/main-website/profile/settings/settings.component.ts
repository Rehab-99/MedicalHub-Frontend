import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currentSection: string = 'profile';
  user: any;
  imagePreview: string | null = null;
  isLoading: boolean = false;

  profileForm: FormGroup;
  securityForm: FormGroup;
  notificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });

    this.securityForm = this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    });

    this.notificationForm = this.fb.group({
      email_notifications: [true],
      appointment_reminders: [true],
      prescription_notifications: [true]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.authService.getUserData();
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address
      });
      this.imagePreview = this.user.image;
    }
  }

  setSection(section: string): void {
    this.currentSection = section;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      Object.keys(this.profileForm.value).forEach(key => {
        formData.append(key, this.profileForm.value[key]);
      });

      // Add image if changed
      const imageInput = document.getElementById('image-upload') as HTMLInputElement;
      if (imageInput?.files?.length) {
        formData.append('image', imageInput.files[0]);
      }

      this.authService.updateProfile(formData).subscribe({
        next: (response) => {
          this.toastr.success('تم تحديث الملف الشخصي بنجاح');
          this.authService.setUser(response.user);
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error(error.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
          this.isLoading = false;
        }
      });
    }
  }

  onSecuritySubmit(): void {
    if (this.securityForm.valid) {
      this.isLoading = true;
      const { current_password, new_password, confirm_password } = this.securityForm.value;

      if (new_password !== confirm_password) {
        this.toastr.error('كلمات المرور غير متطابقة');
        return;
      }

      this.authService.updatePassword({
        current_password,
        new_password
      }).subscribe({
        next: () => {
          this.toastr.success('تم تحديث كلمة المرور بنجاح');
          this.securityForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error(error.message || 'حدث خطأ أثناء تحديث كلمة المرور');
          this.isLoading = false;
        }
      });
    }
  }

  onNotificationSubmit(): void {
    if (this.notificationForm.valid) {
      this.isLoading = true;
      this.authService.updateNotificationSettings(this.notificationForm.value).subscribe({
        next: () => {
          this.toastr.success('تم تحديث إعدادات الإشعارات بنجاح');
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error(error.message || 'حدث خطأ أثناء تحديث إعدادات الإشعارات');
          this.isLoading = false;
        }
      });
    }
  }
} 