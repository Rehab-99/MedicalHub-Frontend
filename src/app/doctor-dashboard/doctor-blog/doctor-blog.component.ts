import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../services/blog/post.service';
import { BlogService } from '../../services/blog/blog.service';
import { RelativeTimePipe } from '../add-post/pipe/relative-time.pipe';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-doctor-blog',
  templateUrl: './doctor-blog.component.html',
  styleUrls: ['./doctor-blog.component.css'],
  imports: [CommonModule,SidebarComponent ,RouterModule, RelativeTimePipe],
  providers: [PostService, BlogService]
})
export class DoctorBlogComponent implements OnInit {
  posts: any[] = [];
  errorMessage: string | null = null;
  doctorId: number | null = null;
  role: 'human' | 'vet' | null = null;

  constructor(
    private postService: PostService,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');
    this.doctorId = doctor.id || null;
    this.role = doctor.type === 'vet' ? 'vet' : 'human'; // Assuming doctor.type is 'vet' or 'human'
    if (this.doctorId && this.role) {
      this.loadPosts();
    } else {
      this.errorMessage = 'Doctor not logged in or role not specified';
    }

    this.blogService.postsUpdated$.subscribe(() => {
      this.loadPosts();
    });
  }

  loadPosts(): void {
    this.postService.getAllPosts(this.role!).subscribe({
      next: (res) => {
        this.posts = res.data.filter((post: any) => post.doctor_id === this.doctorId);
        this.errorMessage = null;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load posts';
      }
    });
  }

  getPostLink(postId: number): string[] {
    const basePath = this.role === 'vet' ? '/blog/vet' : '/blog/human';
    return [basePath, postId.toString()];
  }

  editPost(postId: number): void {
    this.router.navigate(['/doctor-dashboard/edit-post', postId]);
  }

  deletePost(postId: number): void {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.loadPosts();
        this.blogService.notifyPostsUpdated();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to delete post';
      }
    });
  }
}