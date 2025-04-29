import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../../../../../services/blog/post.service';
import { DoctorService } from '../../../../../services/doctor.service';
import { DatePipe, CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { CommentsComponent } from '../../../comments/comments.component';
import { ImageSanitizerPipe } from '../../../../../doctor-dashboard/add-post/pipe/image-sanitizer.pipe';
import { SafeUrlPipe } from '../../../../../doctor-dashboard/add-post/pipe/safe-url.pipe';

@Component({
  selector: 'app-human-blog-detail',
  standalone: true,
  templateUrl: './human-blog-detail.component.html',
  styleUrls: ['./human-blog-detail.component.css'],
  providers: [DatePipe],
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterModule,
    CommentsComponent,
    ImageSanitizerPipe,
    SafeUrlPipe
  ],
})
export class HumanBlogDetailComponent implements OnInit {
  post: any;
  doctorName: string = '';
  doctorImage: string = '';
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private doctorService: DoctorService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      this.fetchPost(postId);
    } else {
      this.errorMessage = 'Invalid Post ID';
    }
  }

  fetchPost(postId: number): void {
    this.postService.getPostById(postId).subscribe({
      next: (res) => {
        console.log('Post fetched:', res);
        this.post = res.data;
        if (this.post.doctor_id) {
          this.fetchDoctorDetails(this.post.doctor_id);
        } else {
          console.log('No doctor_id found in post');
          this.doctorName = 'Unknown Doctor';
          this.doctorImage = '';
        }
      },
      error: (err) => {
        console.error('Error fetching post:', err);
        this.errorMessage = 'Failed to load post.';
      },
    });
  }

  fetchDoctorDetails(doctorId: number): void {
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (response: any) => {
        const doctor = response.data || {};
        this.doctorName = doctor.name || 'Unknown Doctor';
        this.doctorImage = doctor.image || '';
        console.log('Fetched doctor:', { name: this.doctorName, image: this.doctorImage });
      },
      error: (err) => {
        console.error('Error fetching doctor:', err);
        this.doctorName = 'Unknown Doctor';
        this.doctorImage = '';
      },
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || date;
  }

  goBack(): void {
    this.router.navigate(['/blog/human']);
  }
}