import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../../services/blog/comment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;
  comments: any[] = [];
  newComment: string = '';
  errorMessage: string = '';

  constructor(
    private commentService: CommentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getCommentsByPostId(this.postId).subscribe({
      next: (data: any[]) => {
        this.comments = data;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load comments';
        this.toastr.error('Failed to load comments');
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) return;

    this.commentService.createComment({
      post_id: this.postId,
      content: this.newComment
    }).subscribe({
      next: (response: any) => {
        this.comments.push(response);
        this.newComment = '';
        this.toastr.success('Comment added successfully');
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to add comment';
        this.toastr.error('Failed to add comment');
      }
    });
  }
}
