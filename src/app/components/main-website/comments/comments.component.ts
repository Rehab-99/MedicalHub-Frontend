import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommentService } from '../../../services/blog/comment.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;
  comments: any[] = [];
  newComment: string = '';
  isLoggedIn: boolean = false;
  currentUserId: number | null = null;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadComments();
    this.loadCurrentUser();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  loadCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user ? user.id : null;
    });
  }

  loadComments(): void {
    if (this.postId) {
      this.commentService.getCommentsByPostId(this.postId).subscribe({
        next: (res) => {
          this.comments = res.data;
          console.log('Comments fetched:', this.comments);
        },
        error: (err) => {
          console.error('Error fetching comments:', err);
          this.toastr.error('Failed to load comments.');
        }
      });
    }
  }

  submitComment(): void {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to post a comment.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.newComment.trim()) {
      this.toastr.warning('Comment cannot be empty.');
      return;
    }

    const commentData = {
      post_id: this.postId,
      comment: this.newComment
    };

    this.commentService.createComment(commentData).subscribe({
      next: (res) => {
        this.comments.push(res.data);
        this.newComment = '';
        this.toastr.success('Comment posted successfully!');
      },
      error: (err) => {
        console.error('Error posting comment:', err);
        const errorMessage = err.error?.message || 'Failed to post comment.';
        if (err.status === 401) {
          this.toastr.error('Session expired. Please log in again.');
          this.authService.logout();
        } else if (err.status === 422) {
          this.toastr.error(err.error.errors?.comment || errorMessage);
        } else {
          this.toastr.error(errorMessage);
        }
      }
    });
  }

  deleteComment(commentId: number): void {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to delete a comment.');
      this.router.navigate(['/login']);
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(commentId).subscribe({
          next: () => {
            this.comments = this.comments.filter(comment => comment.id !== commentId);
            this.toastr.success('Comment deleted successfully!');
          },
          error: (err) => {
            console.error('Error deleting comment:', err);
            const errorMessage = err.error?.message || 'Failed to delete comment.';
            this.toastr.error(errorMessage);
          }
        });
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}