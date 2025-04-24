import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogService } from '../../../services/blog/blog.service';
import { PostService } from '../../../services/blog/post.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-vet-blog-dashboard',
  templateUrl: './vet-blog.component.html',
  styleUrls: ['./vet-blog.component.css'],
  providers: [PostService, BlogService],
  imports: [CommonModule, RouterModule],
})
export class VetBlogComponent implements OnInit, OnDestroy {
  vetPosts: any[] = [];
  errorMessage: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private postService: PostService,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVetPosts();
    this.subscription.add(
      this.blogService.postsUpdated$.subscribe(() => {
        this.loadVetPosts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadVetPosts(): void {
    this.postService.getAllPosts('vet').subscribe({
      next: (res) => {
        console.log('Vet Posts Response:', res.data);
        this.vetPosts = res.data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error fetching vet posts:', err);
        this.errorMessage = 'Failed to load posts';
      }
    });
  }
}