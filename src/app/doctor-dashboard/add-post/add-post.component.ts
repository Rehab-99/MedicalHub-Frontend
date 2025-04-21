import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router, // Keep private, we'll use a method
    private cdr: ChangeDetectorRef
  ) {
    this.addPostForm = this.fb.group({
      category: ['human', Validators.required],
      sections: this.fb.array([this.createSection()])
    });
  }

  get sections(): FormArray {
    return this.addPostForm.get('sections') as FormArray;
  }

  createSection(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      image: [null, Validators.required]
    });
  }

  addSection() {
    this.sections.push(this.createSection());
    this.cdr.detectChanges();
  }

  removeSection(index: number) {
    if (this.sections.length > 1) {
      this.sections.removeAt(index);
      this.cdr.detectChanges();
    }
  }

  onFileChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.sections.at(index).patchValue({ image: file });
    }
  }

  onSubmit() {
    if (this.addPostForm.invalid) {
      this.addPostForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('category', this.addPostForm.get('category')?.value);

    this.sections.controls.forEach((section, index) => {
      formData.append(`sections[${index}][title]`, section.get('title')?.value);
      formData.append(`sections[${index}][content]`, section.get('content')?.value);
      const image = section.get('image')?.value;
      if (image) {
        formData.append(`sections[${index}][image]`, image);
      }
    });

    this.postService.createPost(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/doctor-dashboard']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to add the post. Please try again.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  cancel() {
    this.router.navigate(['/doctor-dashboard']);
  }

  get titleControls() {
    return this.sections.controls.map(control => control.get('title'));
  }

  get contentControls() {
    return this.sections.controls.map(control => control.get('content'));
  }

  get imageControls() {
    return this.sections.controls.map(control => control.get('image'));
  }
}