import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { PostService } from '../../../../../services/blog/post.service';
import { BlogService } from '../../../../../services/blog/blog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vet-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './vet-blog-list.component.html',
  styleUrls: ['./vet-blog-list.component.css'],
  providers: [DatePipe],
})
export class VetBlogListComponent implements OnInit, OnDestroy {
  vetBlogPosts: any[] = [];
  errorMessage: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private postService: PostService,
    private blogService: BlogService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getAllVetPosts();
    this.subscription.add(
      this.blogService.postsUpdated$.subscribe(() => {
        this.getAllVetPosts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getAllVetPosts() {
    this.postService.getAllPosts('vet').subscribe({
      next: (res) => {
        this.vetBlogPosts = res.data;
        console.log('Vet Blog Posts:', this.vetBlogPosts);
        this.errorMessage = null;
      },
      error: (err: any) => {
        console.error('Error fetching vet posts:', err);
        if (err.status === 401) {
          this.errorMessage = 'Please log in to view posts';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Failed to load posts. Please try again later.';
        }
      },
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || date;
  }

  viewPost(postId: number) {
    this.router.navigate(['//workspaces/blog/vet', postId]);
  }
}