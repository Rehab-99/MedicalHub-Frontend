import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { PostService } from '../../../../../services/blog/post.service';
import { BlogService } from '../../../../../services/blog/blog.service';
import { DoctorService } from '../../../../../services/doctor.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { StripHtmlPipe } from '../../../../../doctor-dashboard/add-post/pipe/strip-html.pipe';
import { RelativeTimePipe } from '../../../../../doctor-dashboard/add-post/pipe/relative-time.pipe';

@Component({
  selector: 'app-vet-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    StripHtmlPipe,
    RelativeTimePipe
  ],
  templateUrl: './vet-blog-list.component.html',
  styleUrls: ['./vet-blog-list.component.css'],
  providers: [DatePipe],
})
export class VetBlogListComponent implements OnInit, OnDestroy {
  vetBlogPosts: any[] = [];
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
    this.getAllVetPosts();
    this.subscription.add(
      this.blogService.postsUpdated$.subscribe(() => {
        console.log('Posts updated, refreshing vet posts');
        this.getAllVetPosts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getAllVetPosts() {
    this.postService.getAllPosts('vet').subscribe({
      next: (res: { data: { id: number; [key: string]: any }[] }) => {
        // فلترة التكرارات بناءً على post.id
        const uniquePosts = Array.from(
          new Map((res.data || []).map((post: { id: number }) => [post.id, post])).values()
        );
        this.vetBlogPosts = uniquePosts;
        console.log('Fetched vet posts:', this.vetBlogPosts);

        // ترتيب البوستات من الأحدث للأقدم
        this.vetBlogPosts.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime(); // من الأحدث للأقدم
        });
        console.log('Sorted vet posts:', this.vetBlogPosts);

        this.errorMessage = null;
        this.fetchDoctorNames();
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

  fetchDoctorNames() {
    this.vetBlogPosts.forEach((post) => {
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
    this.router.navigate(['/blog/vet', postId]);
  }
}