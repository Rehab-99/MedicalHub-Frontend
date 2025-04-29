import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { PostService } from '../../../../../services/blog/post.service';
import { BlogService } from '../../../../../services/blog/blog.service';
import { DoctorService } from '../../../../../services/doctor.service';
import { Subscription } from 'rxjs';
import { StripHtmlPipe } from '../../../../../doctor-dashboard/add-post/pipe/strip-html.pipe';
import { RelativeTimePipe } from '../../../../../doctor-dashboard/add-post/pipe/relative-time.pipe';

@Component({
  selector: 'app-human-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    StripHtmlPipe,
    RelativeTimePipe
  ],
  templateUrl: './human-blog-list.component.html',
  styleUrls: ['./human-blog-list.component.css'],
  providers: [DatePipe],
})
export class HumanBlogListComponent implements OnInit, OnDestroy {
  humanBlogPosts: any[] = [];
  errorMessage: string | null = null;
  private subscription: Subscription = new Subscription();
  doctorNames: { [key: number]: string } = {};

  constructor(
    private postService: PostService,
    private blogService: BlogService,
    private doctorService: DoctorService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getAllHumanPosts();
    this.subscription.add(
      this.blogService.postsUpdated$.subscribe(() => {
        console.log('Posts updated, refreshing human posts');
        this.getAllHumanPosts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getAllHumanPosts() {
    this.postService.getAllPosts('human').subscribe({
      next: (res) => {
        this.humanBlogPosts = res.data || [];
        console.log('Fetched human posts:', this.humanBlogPosts);
        // إضافة البوستات اللي role: null
        this.postService.getAllPosts().subscribe({
          next: (nullRes) => {
            const nullRolePosts = (nullRes.data || []).filter((post: any) => post.role === null);
            this.humanBlogPosts = [...this.humanBlogPosts, ...nullRolePosts];
            console.log('Fetched posts with role: null:', nullRolePosts);
            // ترتيب البوستات من الأحدث للأقدم
            this.humanBlogPosts.sort((a, b) => {
              const dateA = new Date(a.created_at);
              const dateB = new Date(b.created_at);
              return dateB.getTime() - dateA.getTime(); // من الأحدث للأقدم
            });
            console.log('Sorted human posts:', this.humanBlogPosts);
            this.fetchDoctorNames();
          },
          error: (err) => {
            console.error('Error fetching null role posts:', err);
          }
        });
        this.errorMessage = null;
      },
      error: (err: any) => {
        console.error('Error fetching human posts:', err);
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

  fetchDoctorNames() {
    this.humanBlogPosts.forEach((post) => {
      if (post.doctor_id) {
        this.doctorService.getDoctorById(post.doctor_id).subscribe({
          next: (response: any) => {
            const doctorName = response.data?.name || 'Unknown Doctor';
            this.doctorNames[post.doctor_id] = doctorName;
            console.log(`Fetched doctor name for ID ${post.doctor_id}: ${doctorName}`);
          },
          error: (err) => {
            console.error('Error fetching doctor:', err);
            this.doctorNames[post.doctor_id] = 'Unknown Doctor';
          },
        });
      }
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || date;
  }

  viewPost(postId: number) {
    this.router.navigate(['/blog/human', postId]);
  }
}