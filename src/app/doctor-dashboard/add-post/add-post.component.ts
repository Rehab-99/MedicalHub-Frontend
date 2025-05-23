import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/blog/post.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule, SidebarComponent,CommonModule, SafeHtmlPipe],
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
  wordCount = 0;
  lastInsertedImage: HTMLImageElement | null = null;

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
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
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
    this.addPostForm.get('content')?.valueChanges.subscribe(() => {
      this.updateWordCount();
    });
  }

  ngOnDestroy(): void {}

  formatText(command: string, value?: string): void {
    document.execCommand(command, false, value);
    this.updateContent();
    this.focusEditor();
  }

  setFontSize(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const size = selectElement.value;
    document.execCommand('fontSize', false, size);
    this.updateContent();
    this.focusEditor();
  }

  toggleColorPalette(): void {
    this.showColorPalette = !this.showColorPalette;
    this.focusEditor();
  }

  setTextColor(color: string): void {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const selectedText = selection?.toString();
    
    if (selectedText && selectedText.length > 0) {
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('foreColor', false, color);
    } else {
      const span = document.createElement('span');
      span.style.color = color;
      span.textContent = ' ';
      
      if (range) {
        range.deleteContents();
        range.insertNode(span);
        
        const newRange = document.createRange();
        newRange.setStartAfter(span);
        newRange.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      } else {
        this.editor.nativeElement.appendChild(span);
      }
    }
    
    this.showColorPalette = false;
    this.updateContent();
    this.focusEditor();
  }

  alignImage(alignment: 'left' | 'center' | 'right'): void {
    if (this.lastInsertedImage) {
      this.lastInsertedImage.style.display = 'block';
      this.lastInsertedImage.style.float = alignment === 'center' ? 'none' : alignment;
      this.lastInsertedImage.style.margin = alignment === 'center' ? '0 auto' : `0 ${alignment === 'left' ? '0' : '0'} 0 ${alignment === 'right' ? '0' : '0'}`;
      this.updateContent();
    }
  }

  triggerImageUpload(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => this.insertImage(e);
    fileInput.click();
  }

  insertImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select an image file';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '12px auto';
        img.setAttribute('data-filename', file.name);
        
        this.insertAtCursor(img);
        this.updateContent();
        this.lastInsertedImage = img;
      };
      reader.readAsDataURL(file);
    }
  }

  private insertAtCursor(node: Node): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
      
      const newRange = document.createRange();
      newRange.setStartAfter(node);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      this.editor.nativeElement.appendChild(node);
    }
  }

  private focusEditor(): void {
    this.editor.nativeElement.focus();
  }

  updateContent(): void {
    const content = this.editor.nativeElement.innerHTML;
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

  openPreview(): void {
    this.showPreview = true;
  }

  closePreview(): void {
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

      return match.replace(base64String, `placeholder_${filename}`);
    });

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

    images.forEach((image) => {
      formData.append(`inline_images[]`, image, image.name);
    });

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post created successfully',
          timer: 2000
        }).then(() => {
          this.router.navigate(['/doctor-dashboard']);
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message;
      }
    });
  }

  private markFormAsTouched(): void {
    Object.values(this.addPostForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}