import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/blog/post.service';
import { LoginDoctorService } from '../../services/login-doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  addPostForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  doctorRole: string | null = null;
  doctorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private loginDoctorService: LoginDoctorService,
    private router: Router
  ) {
    this.addPostForm = this.fb.group({
      title: [''],
      content: [''],
      image: [null]
    });
  }

  ngOnInit() {
    const token = this.loginDoctorService.getToken();
    const doctor = this.loginDoctorService.getDoctor();
    this.doctorId = doctor?.id || null;
    this.doctorRole = localStorage.getItem('doctor_role');

    if (!token || !this.doctorId || !this.doctorRole) {
      this.errorMessage = 'You need to log in as a doctor to add a post.';
      setTimeout(() => {
        this.router.navigate(['/doctor-login']);
      }, 2000);
    }
  }

  onPostImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.addPostForm.patchValue({ image: input.files[0] });
    }
  }

  formatText(command: string, value?: string) {
    document.execCommand(command, false, value);
    this.updateContent();
  }

  onFontSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.formatText('fontSize', target.value);
    }
  }

  onColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.formatText('foreColor', target.value);
    }
  }

  insertImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgSrc = e.target?.result as string;
        document.execCommand('insertImage', false, imgSrc);
        this.updateContent();
      };
      reader.readAsDataURL(file);
    }
  }

  triggerInsertImage() {
    const input = document.getElementById('insert-image') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  updateContent() {
    const editor = document.getElementById('post-content-editor') as HTMLDivElement;
    if (editor) {
      this.addPostForm.get('content')?.setValue(editor.innerHTML);
    }
  }

  onSubmit() {
    if (!this.doctorId || !this.doctorRole) {
      this.errorMessage = 'Cannot submit post: Please log in as a doctor.';
      this.isSubmitting = false;
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('title', this.addPostForm.get('title')?.value || '');
    formData.append('content', this.addPostForm.get('content')?.value || '');
    formData.append('role', this.doctorRole);
    formData.append('doctor_id', this.doctorId.toString());
    const postImage = this.addPostForm.get('image')?.value;
    if (postImage instanceof File) {
      formData.append('image', postImage);
    }

    console.log('Submitting FormData:', [...formData.entries()]);
    this.postService.createPost(formData).subscribe({
      next: (response) => {
        console.log('Post created successfully:', response);
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: 'Post added successfully.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/doctor-blog']);
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to add post. Please try again.';
        console.error('Error creating post:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/doctor-blog']);
  }
}