// src/app/services/blog/blog.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private postsUpdatedSubject = new BehaviorSubject<void>(undefined);
  postsUpdated$: Observable<void> = this.postsUpdatedSubject.asObservable();

  // إبلاغ الكومبوننتس إن البوستات اتحدثت
  notifyPostsUpdated() {
    this.postsUpdatedSubject.next();
  }
}