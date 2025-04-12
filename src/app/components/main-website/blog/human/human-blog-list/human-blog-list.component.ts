import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../footer/footer.component';
import { HeaderComponent } from '../../../header/header.component';


@Component({
  selector: 'app-human-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './human-blog-list.component.html',
  styleUrls: ['./human-blog-list.component.css'],
})
export class HumanBlogListComponent implements OnInit {
  humanBlogPosts = [
    { id: 1, title: 'Health Tips', content: 'Tips for human health...', date: new Date() },
    { id: 2, title: 'Human Blog 2', content: 'Another human blog...', date: new Date('2025-04-01') },
  ]; // داتا مؤقتة

  constructor(private router: Router) {}

  ngOnInit(): void {
    // هنا هتجيبي الداتا من API لما تربطي الـ backend
  }

  viewPost(postId: number) {
    this.router.navigate(['/blog/human', postId]);
  }
}