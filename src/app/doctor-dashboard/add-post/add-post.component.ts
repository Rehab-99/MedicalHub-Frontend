import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/blog/post.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  addPostForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  doctorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.addPostForm = this.fb.group({
      title: [''],
      content: [''],
      image: [null],
      sections: this.fb.array([])
    });

    // Extract doctor_id from localStorage
    const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');
    this.doctorId = doctor.id || null;
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
    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    // Add doctor_id to FormData if available
    if (this.doctorId) {
      formData.append('doctor_id', this.doctorId.toString());
    } else {
      console.warn('No doctor_id found in localStorage');
    }
    formData.append('title', this.addPostForm.get('title')?.value || '');
    formData.append('content', this.addPostForm.get('content')?.value || '');
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

    console.log('FormData being sent:', [...formData.entries()]); // Debug FormData
    this.postService.createPost(formData).subscribe({
      next: (response) => {
        console.log('Post created successfully:', response);
        this.isSubmitting = false;
        this.router.navigate(['/doctor-blog']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        const errors = err.error?.errors || err.error?.message || 'Failed to add the post. Please try again.';
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