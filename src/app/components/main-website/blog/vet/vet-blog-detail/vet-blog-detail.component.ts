import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../../../../../services/blog/post.service';
import { DoctorService } from '../../../../../services/doctor.service';
import { DatePipe, CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { CommentsComponent } from '../../../comments/comments.component'; // أضف هنا

@Component({
  selector: 'app-vet-blog-detail',
  standalone: true,
  templateUrl: './vet-blog-detail.component.html',
  styleUrls: ['./vet-blog-detail.component.css'],
  providers: [DatePipe],
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterModule, CommentsComponent], // أضف CommentsComponent
})
export class VetBlogDetailComponent implements OnInit {
  post: any;
  doctorName: string = '';
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
          this.fetchDoctorName(this.post.doctor_id);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load post.';
      },
    });
  }

  fetchDoctorName(doctorId: number): void {
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (doctor: any) => {
        this.doctorName = doctor.name;
      },
      error: (err) => {
        console.error('Error fetching doctor:', err);
      },
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || date;
  }
}