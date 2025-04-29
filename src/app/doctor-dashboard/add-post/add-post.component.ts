import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/blog/post.service';
import { interval, Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SafeHtmlPipe],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  animations: [
    trigger('modalAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(50px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', animate('300ms ease-out')),
      transition(':leave', animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(50px)' })))
    ])
  ]
})
export class AddPostComponent implements OnInit, OnDestroy {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  addPostForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showColorPalette = false;
  showPreview = false;
  isDarkMode = false;
  isAutoSaving = false;
  lastAutoSaved: Date | null = null;
  wordCount = 0;
  autoSaveSubscription: Subscription | null = null;

  fontSizeMap: { [key: string]: string } = {
    '1': '12px',
    '2': '14px',
    '3': '16px',
    '4': '18px',
    '5': '20px',
    '6': '24px',
    '7': '28px'
  };

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    public router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.addPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
    // Load theme from localStorage
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    // Start auto-save every 30 seconds
    this.autoSaveSubscription = interval(30000).subscribe(() => {
      if (this.addPostForm.valid) {
        this.autoSaveDraft();
      }
    });
    // Update word count on content change
    this.addPostForm.get('content')?.valueChanges.subscribe(() => {
      this.updateWordCount();
    });
  }

  ngOnDestroy(): void {
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
  }

  formatText(command: string, value?: string): void {
    console.log(`Executing command: ${command}`, value);
    const success = document.execCommand(command, false, value);
    if (!success) {
      console.warn(`Command ${command} failed`);
    }
    this.updateContent();
  }

  setFontSize(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const size = selectElement.value;
    const fontSize = this.fontSizeMap[size] || '16px';
    console.log(`Setting font size: ${size} (${fontSize})`);
    document.execCommand('fontSize', false, size);
    this.updateContent();
  }

  toggleColorPalette(): void {
    console.log('Toggling color palette, current state:', this.showColorPalette);
    this.showColorPalette = !this.showColorPalette;
  }

  setTextColor(color: string): void {
    console.log(`Setting text color: ${color}`);
    const success = document.execCommand('foreColor', false, color);
    if (!success) {
      console.warn(`Failed to set color: ${color}`);
    }
    this.updateContent();
    this.showColorPalette = false;
  }

  alignImage(alignment: 'left' | 'center' | 'right'): void {
    console.log(`Aligning image: ${alignment}`);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedNode = range.startContainer.parentElement;
      if (selectedNode?.tagName === 'IMG') {
        selectedNode.style.display = 'block';
        if (alignment === 'center') {
          selectedNode.style.margin = '12px auto';
          selectedNode.style.float = 'none';
        } else {
          selectedNode.style.margin = '12px';
          selectedNode.style.float = alignment;
        }
        this.updateContent();
      } else {
        console.warn('No image selected for alignment');
      }
    }
  }

  insertImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select an image file';
        return;
      }

      console.log('Inserting image:', file.name, file.type, file.size);

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.setAttribute('data-filename', file.name);
        this.editor.nativeElement.appendChild(img);
        this.updateContent();
      };
      reader.readAsDataURL(file);
    }
  }

  updateContent(): void {
    const content = this.editor.nativeElement.innerHTML;
    console.log('Editor content updated:', content);
    this.addPostForm.patchValue({
      content: this.sanitizeContent(content)
    });
    this.updateWordCount();
  }

  private updateWordCount(): void {
    const content = this.addPostForm.get('content')?.value || '';
    const text = content.replace(/<[^>]+>/g, '').trim();
    this.wordCount = text ? text.split(/\s+/).length : 0;
  }

  private sanitizeContent(content: string): string {
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  }

  triggerImageUpload(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => this.insertImage(e);
    fileInput.click();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    console.log('Dark mode toggled:', this.isDarkMode);
  }

  openPreview(): void {
    console.log('Opening preview modal');
    this.showPreview = true;
  }

  closePreview(): void {
    console.log('Closing preview modal');
    this.showPreview = false;
  }

  private extractInlineImages(content: string): { content: string, images: File[] } {
    const images: File[] = [];
    let processedContent = content;

    const imgRegex = /<img[^>]+src=["'](data:image\/([^;]+);base64,[^"']+)["'][^>]*data-filename=["']([^"']+)["'][^>]*>/gi;
    processedContent = processedContent.replace(imgRegex, (match, base64String, imageType, filename) => {
      const extension = imageType.toLowerCase() === 'jpeg' ? 'jpg' : imageType.toLowerCase();
      const base64Data = base64String.split(',')[1];
      const byteString = atob(base64Data);
      const byteArray = new Uint8Array(byteString.length);

      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: `image/${imageType}` });
      const file = new File([blob], filename, { type: `image/${imageType}` });
      images.push(file);

      console.log('Extracted image:', filename, file.type, file.size);

      return match.replace(base64String, `placeholder_${filename}`);
    });

    console.log('Processed content:', processedContent);
    return { content: processedContent, images };
  }

  onSubmit(): void {
    if (this.addPostForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('title', this.addPostForm.value.title);

    const { content, images } = this.extractInlineImages(this.addPostForm.value.content);
    formData.append('content', content);

    images.forEach((image, index) => {
      formData.append(`inline_images[]`, image, image.name);
      console.log('Appending image to FormData:', image.name);
    });

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        console.log('Post created, response:', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post created successfully',
          timer: 2000
        }).then(() => this.router.navigate(['/blog']));
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message;
        console.error('Error creating post:', err);
      }
    });
  }

  saveDraft(): void {
    if (this.addPostForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('title', this.addPostForm.value.title);
    formData.append('content', this.addPostForm.value.content);
    formData.append('status', 'draft');

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        console.log('Draft saved, response:', response);
        Swal.fire({
          icon: 'success',
          title: 'Draft Saved!',
          text: 'Your post has been saved as a draft',
          timer: 2000
        }).then(() => this.router.navigate(['/blog']));
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message;
        console.error('Error saving draft:', err);
      }
    });
  }

  private autoSaveDraft(): void {
    if (this.isSubmitting) return;

    this.isAutoSaving = true;
    const formData = new FormData();
    formData.append('title', this.addPostForm.value.title);
    formData.append('content', this.addPostForm.value.content);
    formData.append('status', 'draft');

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        this.isAutoSaving = false;
        this.lastAutoSaved = new Date();
        console.log('Auto-saved draft:', response);
      },
      error: (err) => {
        this.isAutoSaving = false;
        console.error('Error auto-saving draft:', err);
      }
    });
  }

  private markFormAsTouched(): void {
    Object.values(this.addPostForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}