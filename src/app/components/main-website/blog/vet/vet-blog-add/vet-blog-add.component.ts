import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../footer/footer.component';
import { HeaderComponent } from '../../../header/header.component';

@Component({
  selector: 'app-vet-blog-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './vet-blog-add.component.html',
  styleUrls: ['./vet-blog-add.component.css'],
})
export class VetBlogAddComponent {
  newPost = { title: '', content: '', image: null as File | null };

  constructor(private router: Router) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.newPost.image = input.files[0];
    }
  }

  addBlog() {
    if (this.newPost.title && this.newPost.content) {
      const blogPost = {
        id: Date.now(), // مؤقت لحد ما تربطي الـ backend
        title: this.newPost.title,
        content: this.newPost.content,
        date: new Date(),
        image: this.newPost.image ? URL.createObjectURL(this.newPost.image) : null,
      };
      console.log('New Vet Blog:', blogPost); // هنا هتبعتي للـ API لما تربطي
      this.router.navigate(['/blog/vet']);
    }
  }
}