import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/blog/post.service';
import { BlogService } from '../../../services/blog/blog.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-edit-post-blog',
  templateUrl: './edit-post-blog.component.html',
  styleUrls: ['./edit-post-blog.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class EditPostBlogComponent implements OnInit {
  post: any = { 
    title: '', 
    content: '',
    sections: [] 
  };
  errorMessage: string | null = null;
  postId!: number;
  showSections: boolean = false;

  constructor(
    private postService: PostService,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.loadPost();
  }

  loadPost(): void {
    this.postService.getPostById(this.postId).subscribe({
      next: (res) => {
        this.post = res.data;
        this.showSections = this.post.sections && this.post.sections.length > 0;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load post data';
      }
    });
  }

  updatePost(): void {
    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    
    if (this.post.sections && this.post.sections.length > 0) {
      this.post.sections.forEach((section: any, index: number) => {
        formData.append(`sections[${index}][title]`, section.title);
        formData.append(`sections[${index}][content]`, section.content);
      });
    }

    this.postService.updatePost(this.postId, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'The post has been updated successfully.',
          timer: 2000
        });
        this.blogService.notifyPostsUpdated();
        this.router.navigate(['/doctor-blog']);
      },
      error: (err) => {
        console.error('Failed to update:', err);
        Swal.fire('Error', 'Failed to update the post.', 'error');
      }
    });
  }

  toggleSections(): void {
    this.showSections = !this.showSections;
  }
}