import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog/blog.service';
import { PostService } from '../../../services/blog/post.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    this.postService.getAllPosts('human').subscribe({
      next: (res) => {
        console.log('Human Posts Response:', res.data);
        this.humanPosts = res.data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error fetching human posts:', err);
        this.errorMessage = 'Failed to load posts';
      }
    });
  }
}