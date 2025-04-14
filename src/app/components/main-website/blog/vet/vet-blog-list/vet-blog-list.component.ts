import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';

import { PostService } from '../../../../../services/blog/post.service';
import { BlogService } from '../../../../../services/blog/blog.service'; // استورد BlogService
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common'; // استورد DatePipe
import { DoctorService } from '../../../../../services/doctor.service';

@Component({
  selector: 'app-vet-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './vet-blog-list.component.html',
  styleUrls: ['./vet-blog-list.component.css'],
  providers: [DatePipe], // أضف DatePipe إلى الـ providers هنا
})
export class VetBlogListComponent implements OnInit, OnDestroy {
  vetBlogPosts: any[] = [];
  errorMessage: string | null = null;
  private subscription: Subscription = new Subscription();
  doctorNames: { [key: number]: string } = {}; // لتخزين أسماء الأطباء بناءً على doctor_id

  constructor(
    private postService: PostService,
    private blogService: BlogService, // أضف BlogService
    private doctorService: DoctorService, // أضف DoctorService
    private router: Router,
    private datePipe: DatePipe // أضف DatePipe
  ) {}

  ngOnInit(): void {
    this.getAllVetPosts();
    // اسمع لتحديثات البوستات
    this.subscription.add(
      this.blogService.postsUpdated$.subscribe(() => {
        this.getAllVetPosts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // منع Memory Leaks
  }

  getAllVetPosts() {
    this.postService.getAllPosts().subscribe({
      next: (res) => {
        this.vetBlogPosts = res.data; // تأكد إن شكل الـ Response كده
        console.log(this.vetBlogPosts); // هنا هتجيبي الداتا من API لما تربطي الـ backend
        this.errorMessage = null;
        this.fetchDoctorNames(); // جلب أسماء الأطباء
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
    // جلب أسماء الأطباء بناءً على doctor_id في البوستات
    this.vetBlogPosts.forEach((post) => {
      if (post.doctor_id) {
        this.doctorService.getDoctorById(post.doctor_id).subscribe({
          next: (doctor: { name: string }) => {
            this.doctorNames[post.doctor_id] = doctor.name; // تخزين اسم الدكتور
          },
          error: (err) => {
            console.error('Error fetching doctor:', err);
          },
        });
      }
    });
  }

  formatDate(date: string): string {
    // تنسيق التاريخ باستخدام DatePipe
    return this.datePipe.transform(date, 'dd MMM yyyy') || date; // تأكد من تنسيق التاريخ بشكل مناسب
  }

  viewPost(postId: number) {
    this.router.navigate(['/blog/vet', postId]);
  }
}
