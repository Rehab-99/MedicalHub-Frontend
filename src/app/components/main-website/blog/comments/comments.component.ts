import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommentService } from '../../../../services/blog/comment.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  imports: [CommonModule, FormsModule],
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;
  comments: any[] = [];
  newComment: string = '';
  errorMessage: string | null = null;
  currentUserId: number | null = null; // هتعدله بناءً على الـ auth بتاعك

  constructor(
    private commentService: CommentService,
    private toastr: ToastrService
  ) {
    // هنا افترض إنك بتجيب الـ user ID من الـ auth service
    // مثلاً: this.currentUserId = this.authService.getCurrentUserId();
    this.currentUserId = 1; // قيمة مؤقتة، استبدلها بالـ auth logic
  }

  ngOnInit(): void {
    if (this.postId) {
      this.fetchComments();
    }
  }

  fetchComments(): void {
    this.commentService.getCommentsByPostId(this.postId).subscribe({
      next: (res) => {
        this.comments = res.data || [];
      },
      error: (err) => {
        this.errorMessage = 'Failed to load comments.';
        console.error(err);
      },
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) {
      this.toastr.warning('Please enter a comment.', 'Warning');
      return;
    }

    const commentData = {
      post_id: this.postId,
      content: this.newComment,
      user_id: this.currentUserId, // أضيف الـ user_id لو الـ API بيطلبها
    };

    this.commentService.createComment(commentData).subscribe({
      next: (res) => {
        this.comments.push(res.data);
        this.newComment = '';
        this.toastr.success('Comment added successfully!', 'Success');
      },
      error: (err) => {
        this.toastr.error('Failed to add comment.', 'Error');
        console.error(err);
      },
    });
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter((comment) => comment.id !== commentId);
          this.toastr.success('Comment deleted successfully!', 'Success');
        },
        error: (err) => {
          this.toastr.error('Failed to delete comment.', 'Error');
          console.error(err);
        },
      });
    }
  }

  // إضافة الدالة الجديدة
  canDeleteComment(comment: any): boolean {
    // لو اليوزر هو صاحب الكومنت، رجع true
    return this.currentUserId === comment.user_id;
  }
}