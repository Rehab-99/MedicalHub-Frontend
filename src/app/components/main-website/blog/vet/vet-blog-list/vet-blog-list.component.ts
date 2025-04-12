import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-vet-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './vet-blog-list.component.html',
  styleUrls: ['./vet-blog-list.component.css'],
})
export class VetBlogListComponent implements OnInit {
  vetBlogPosts = [
    { id: 1, title: 'Pet Care Tips', content: 'Tips for vet care...', date: new Date() },
    { id: 2, title: 'Vet Blog 2', content: 'Another vet blog...', date: new Date('2025-03-15') },
  ]; // داتا مؤقتة

  constructor(private router: Router) {}

  ngOnInit(): void {
    // هنا هتجيبي الداتا من API لما تربطي الـ backend
  }

  viewPost(postId: number) {
    this.router.navigate(['/blog/vet', postId]);
  }
}