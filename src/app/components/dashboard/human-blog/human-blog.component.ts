import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog/blog.service';
import { PostService } from '../../../services/blog/post.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-human-blog-dashboard',
  templateUrl: './human-blog.component.html',
  styleUrls: ['./human-blog.component.css'],
  providers: [PostService, BlogService],
  imports: [CommonModule, RouterModule],
})
export class HumanBlogComponent implements OnInit {
  humanPosts: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private postService: PostService,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHumanPosts();

    this.blogService.postsUpdated$.subscribe(() => {
      this.loadHumanPosts();
    });
  }

  loadHumanPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (res) => {
        console.log('Human Posts Response:', res.data); // للمساعدة في الديباج
        this.humanPosts = res.data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load posts';
      }
    });
  }

  deletePost(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(id).subscribe({
          next: () => {
            this.humanPosts = this.humanPosts.filter(p => p.id !== id);
            Swal.fire('Deleted!', 'The post has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Failed to delete:', err);
            Swal.fire('Error', 'Failed to delete the post.', 'error');
          }
        });
      }
    });
  }

  editPost(id: number): void {
    console.log('Navigating to edit post with ID:', id);
    this.router.navigate(['/dashboard/post-blog/edit', id]);
  }
}
