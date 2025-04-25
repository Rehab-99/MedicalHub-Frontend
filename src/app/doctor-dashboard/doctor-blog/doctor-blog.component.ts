import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../services/blog/post.service';
import { BlogService } from '../../services/blog/blog.service';

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
    private blogService: BlogService
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
      this.loadPosts();
    });
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
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
}