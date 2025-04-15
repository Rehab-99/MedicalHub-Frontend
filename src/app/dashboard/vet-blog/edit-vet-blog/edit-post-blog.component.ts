import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/blog/post.service';
import { BlogService } from '../../../services/blog/blog.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-edit-vet-blog',
  templateUrl: './edit-post-blog.component.html',
  styleUrls: ['./edit-post-blog.component.css'],
  imports: [CommonModule, FormsModule, RouterModule], // ✅ أضف RouterModule هنا
})
export class EditPostBlogComponent implements OnInit {
  post: any = { title: '', content: '' }; // ✅ احتفظ بهذا فقط
  errorMessage: string | null = null;
  postId!: number;

  constructor(
    private postService: PostService,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.loadPost();
  }

  loadPost(): void {
    this.postService.getPostById(this.postId).subscribe({
      next: (res) => {
        this.post = res.data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load post data';
      }
    });
  }

  updatePost(): void {
    this.postService.updatePost(this.postId, this.post).subscribe({
      next: () => {
        Swal.fire('Updated!', 'The post has been updated successfully.', 'success');
        this.router.navigate(['/dashboard/vet-blog']);
      },
      error: (err) => {
        console.error('Failed to update:', err);
        Swal.fire('Error', 'Failed to update the post.', 'error');
      }
    });
  }
}
