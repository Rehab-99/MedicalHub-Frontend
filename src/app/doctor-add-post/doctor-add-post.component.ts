import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-add-post',
  templateUrl: './doctor-add-post.component.html',
  styleUrls: ['./doctor-add-post.component.css']
})
export class DoctorAddPostComponent {
  postTitle: string = '';
  postContent: string = '';

  constructor(private router: Router) {}

  submitPost() {
    // هنا يمكنك إرسال البيانات إلى API
    console.log('Post Created:', this.postTitle, this.postContent);
    // بعد الإرسال، يمكنك إعادة توجيه المستخدم إلى صفحة أخرى
    this.router.navigate(['/doctor-dashboard']);
  }
}
