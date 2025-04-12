import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  createPost(blogPost: { titles: string[]; content: string; images: File[] }): Observable<any> {
    const formData = new FormData();
    formData.append('content', blogPost.content);

    blogPost.titles.forEach((title: string, index: number) => {
      formData.append(`titles[${index}]`, title);
    });

    blogPost.images.forEach((file: File) => {
      formData.append('images', file);
    });

    return this.http.post('/api/posts', formData);
  }
}
