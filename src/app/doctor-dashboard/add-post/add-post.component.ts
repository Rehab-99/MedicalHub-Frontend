import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/blog/post.service';
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
  doctorRole: string = 'human';
  doctorId: number = 3; // Default doctor_id

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.addPostForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: [null],
      sections: this.fb.array([])
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'You need to log in to add a post.';
      console.error('No authentication token found');
      this.cdr.detectChanges();
      return;
    }

    console.log('Using default doctor_id: 3, role: human');
  }

  get sections(): FormArray {
    return this.addPostForm.get('sections') as FormArray;
  }

  createSection(): FormGroup {
    return this.fb.group({
      title: [''],
      content: [''],
      image: [null]
    });
  }

  addSection() {
    this.sections.push(this.createSection());
    this.cdr.detectChanges();
  }

  removeSection(index: number) {
    this.sections.removeAt(index);
    this.cdr.detectChanges();
  }

  onPostImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.addPostForm.patchValue({ image: file });
    } else {
      this.addPostForm.patchValue({ image: null });
    }
    this.cdr.detectChanges();
  }

  onSectionImageChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.sections.at(index).patchValue({ image: file });
    } else {
      this.sections.at(index).patchValue({ image: null });
    }
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.addPostForm.invalid) {
      this.errorMessage = 'Please fill in the required fields (title and content).';
      console.error('Form is invalid:', this.addPostForm.errors);
      this.cdr.detectChanges();
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Cannot submit post: Please log in.';
      this.isSubmitting = false;
      this.cdr.detectChanges();
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
    if (postImage) {
      formData.append('image', postImage);
    }
    this.sections.controls.forEach((section, index) => {
      formData.append(`sections[${index}][title]`, section.get('title')?.value || '');
      formData.append(`sections[${index}][content]`, section.get('content')?.value || '');
      const sectionImage = section.get('image')?.value;
      if (sectionImage) {
        formData.append(`sections[${index}][image]`, sectionImage);
      }
    });

    console.log('Submitting FormData:', [...formData.entries()]);
    this.postService.createPost(formData).subscribe({
      next: (response) => {
        console.log('Post created successfully:', response);
        this.isSubmitting = false;

        Swal.fire({
          icon: 'success',
          title: 'تم!',
          text: 'البوست تم إضافته بنجاح.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          console.log('Redirecting to /doctor-dashboard');
          this.router.navigate(['/doctor-dashboard']);
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        const errors = err.error?.errors || err.error?.message || 'فشل إضافة البوست. حاولي مرة تانية.';
        this.errorMessage = typeof errors === 'object' ? Object.values(errors).flat().join(', ') : errors;
        console.error('Error creating post:', err);
        this.cdr.detectChanges();
      }
    });
  }

  cancel() {
    this.router.navigate(['/doctor-blog']);
  }
}