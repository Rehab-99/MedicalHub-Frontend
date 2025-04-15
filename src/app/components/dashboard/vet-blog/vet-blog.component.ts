import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../../services/blog/blog.service';
import { PostService } from '../../../services/blog/post.service';

@Component({
  selector: 'app-vet-blog-dashboard',
  templateUrl: './vet-blog.component.html',
  styleUrls: ['./vet-blog.component.cs'],
})
export class VetBlogComponent implements OnInit {
  vetPosts: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private postService: PostService,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVetPosts();

    // لو في تحديث من السيرفيس
    this.blogService.postsUpdated$.subscribe(() => {
      this.loadVetPosts();
    });
  }

  loadVetPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (res) => {
        this.vetPosts = res.data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load posts';
      }
    });
  }

  deletePost(id: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.vetPosts = this.vetPosts.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Failed to delete:', err);
        }
      });
    }
  }

  editPost(id: number): void {
    this.router.navigate(['/dashboard/vet-blog/edit', id]);
  }
}
