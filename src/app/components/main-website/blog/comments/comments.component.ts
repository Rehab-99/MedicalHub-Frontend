import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommentService } from '../../../../services/blog/comment.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  standalone: true, // ✅ لازم يكون standalone = true
  imports: [CommonModule, FormsModule],
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number; // ✅ استقبال postId من الكمبوننت الأب

  commentForm!: FormGroup;
  comments: any[] = [];
  userId: number | null = null;
  newComment: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      user_id: [null, Validators.required],
      post_id: [this.postId, Validators.required],
      comment: ['', Validators.required],
    });

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.commentForm.patchValue({ user_id: this.userId });
      }
    });

    this.getComments();
  }

  getComments() {
    this.commentService.getCommentsByPostId(this.postId).subscribe(
      (comments: any[]) => {
        this.comments = comments;
      },
      error => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  addComment() {
    if (!this.newComment.trim()) {
      this.errorMessage = 'Comment cannot be empty';
      return;
    }

    const commentData = {
      post_id: this.postId,
      user_id: this.userId,
      content: this.newComment,
    };

    this.commentService.createComment(commentData).subscribe(
      (response) => {
        this.toastr.success('Comment added successfully');
        this.newComment = '';
        this.getComments();
      },
      (error) => {
        console.error('Error adding comment:', error);
        this.toastr.error('Failed to add comment');
      }
    );
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe(
      () => {
        this.toastr.success('Comment deleted successfully');
        this.getComments();
      },
      (error) => {
        this.toastr.error('Failed to delete comment');
      }
    );
  }

  canDeleteComment(comment: any): boolean {
    return this.userId === comment.user_id;
  }
}
