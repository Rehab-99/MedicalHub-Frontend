import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { PostService } from '../../../../../services/blog/post.service';
import { BlogService } from '../../../../../services/blog/blog.service';
import { DoctorService } from '../../../../../services/doctor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-human-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
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
        this.getAllHumanPosts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getAllHumanPosts() {
    this.postService.getAllPosts().subscribe({
      next: (res) => {
        this.humanBlogPosts = res.data;
        console.log(this.humanBlogPosts);
        this.errorMessage = null;
        this.fetchDoctorNames();
      },
      error: (err: any) => {
        console.error('Error fetching posts:', err);
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
          next: (doctor: { name: string }) => {
            this.doctorNames[post.doctor_id] = doctor.name;
          },
          error: (err) => {
            console.error('Error fetching doctor:', err);
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
