import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../services/blog/post.service';
import { BlogService } from '../../services/blog/blog.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-doctor-blog',
  templateUrl: './doctor-blog.component.html',
  styleUrls: ['./doctor-blog.component.css'],
  imports: [CommonModule, RouterModule],
  providers: [PostService, BlogService]
})
export class DoctorBlogComponent implements OnInit {
  posts: any[] = [];
  errorMessage: string | null = null;
  doctorId: number | null = null;

  constructor(
    private postService: PostService,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');
    this.doctorId = doctor.id || null;
    if (this.doctorId) {
      this.loadPosts();
    } else {
      this.errorMessage = 'Doctor not logged in';
    }

    this.blogService.postsUpdated$.subscribe(() => {
      console.log('Posts updated notification received');
      this.loadPosts();
    });
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (res) => {
        this.posts = res.data.filter((post: any) => post.doctor_id === this.doctorId);
        console.log('Filtered doctor posts:', this.posts);
        this.errorMessage = null;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load posts';
      }
    });
  }

  editPost(postId: number): void {
    this.router.navigate(['/edit-post-blog', postId]);
  }

  deletePost(postId: number): void {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من استرجاع هذا البوست!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e88e5',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(postId).subscribe({
          next: () => {
            Swal.fire('تم الحذف!', 'البوست تم حذفه بنجاح.', 'success');
            this.blogService.notifyPostsUpdated();
          },
          error: (err) => {
            console.error('Failed to delete post:', err);
            Swal.fire('خطأ', 'فشل حذف البوست.', 'error');
          }
        });
      }
    });
  }
}