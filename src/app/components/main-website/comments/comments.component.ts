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
  editingCommentId: number | null = null;
  editedCommentText: string = '';
  replyingToCommentId: number | null = null;
  replyText: string = '';
  editingReplyId: number | null = null;
  editedReplyText: string = '';

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
          console.log('Main comments response:', res);
          // Get main comments
          const mainComments = res.data;
          
          // Initialize comments array with empty replies
          this.comments = mainComments.map((comment: any) => ({
            ...comment,
            replies: []
          }));
          console.log('Initialized comments:', this.comments);

          // Load replies for each comment
          mainComments.forEach((comment: any) => {
            console.log('Fetching replies for comment:', comment.id);
            this.commentService.getRepliesByCommentId(comment.id).subscribe({
              next: (repliesRes: { data: any[] }) => {
                console.log('Replies response for comment', comment.id, ':', repliesRes);
                // Find the comment in the array and update its replies
                const commentIndex = this.comments.findIndex(c => c.id === comment.id);
                if (commentIndex !== -1) {
                  this.comments[commentIndex].replies = repliesRes.data;
                  console.log('Updated comment with replies:', this.comments[commentIndex]);
                }
              },
              error: (err: any) => {
                console.error('Error fetching replies for comment', comment.id, ':', err);
              }
            });
          });
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

  editComment(comment: any): void {
    this.editingCommentId = comment.id;
    this.editedCommentText = comment.comment;
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editedCommentText = '';
  }

  updateComment(commentId: number): void {
    if (!this.editedCommentText.trim()) {
      this.toastr.warning('Comment cannot be empty.');
      return;
    }

    const commentData = {
      comment: this.editedCommentText
    };

    this.commentService.updateComment(commentId, commentData).subscribe({
      next: (res) => {
        const index = this.comments.findIndex(c => c.id === commentId);
        if (index !== -1) {
          this.comments[index] = res.data;
        }
        this.editingCommentId = null;
        this.editedCommentText = '';
        this.toastr.success('Comment updated successfully!');
      },
      error: (err) => {
        console.error('Error updating comment:', err);
        const errorMessage = err.error?.message || 'Failed to update comment.';
        this.toastr.error(errorMessage);
      }
    });
  }

  replyToComment(comment: any): void {
    this.replyingToCommentId = comment.id;
    this.replyText = '';
  }

  cancelReply(): void {
    this.replyingToCommentId = null;
    this.replyText = '';
  }

  submitReply(commentId: number): void {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to reply to a comment.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.replyText.trim()) {
      this.toastr.warning('Reply cannot be empty.');
      return;
    }

    const replyData = {
      post_id: this.postId,
      parent_id: commentId,
      comment: this.replyText
    };

    this.commentService.createComment(replyData).subscribe({
      next: (res) => {
        const parentComment = this.comments.find(c => c.id === commentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(res.data);
        }
        this.replyingToCommentId = null;
        this.replyText = '';
        this.toastr.success('Reply posted successfully!');
      },
      error: (err) => {
        console.error('Error posting reply:', err);
        const errorMessage = err.error?.message || 'Failed to post reply.';
        this.toastr.error(errorMessage);
      }
    });
  }

  editReply(reply: any): void {
    this.editingReplyId = reply.id;
    this.editedReplyText = reply.comment;
  }

  cancelReplyEdit(): void {
    this.editingReplyId = null;
    this.editedReplyText = '';
  }

  updateReply(replyId: number): void {
    if (!this.editedReplyText.trim()) {
      this.toastr.warning('Reply cannot be empty.');
      return;
    }

    const replyData = {
      comment: this.editedReplyText
    };

    this.commentService.updateComment(replyId, replyData).subscribe({
      next: (res) => {
        this.comments.forEach(comment => {
          if (comment.replies) {
            const replyIndex = comment.replies.findIndex((r: { id: number }) => r.id === replyId);
            if (replyIndex !== -1) {
              comment.replies[replyIndex] = res.data;
            }
          }
        });
        this.editingReplyId = null;
        this.editedReplyText = '';
        this.toastr.success('Reply updated successfully!');
      },
      error: (err) => {
        console.error('Error updating reply:', err);
        const errorMessage = err.error?.message || 'Failed to update reply.';
        this.toastr.error(errorMessage);
      }
    });
  }
}