import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  activeSubmenu: string | null = null;

  toggleSubmenu(submenu: string) {
    this.activeSubmenu = this.activeSubmenu === submenu ? null : submenu;
  }

  isSubmenuActive(submenu: string): boolean {
    return this.activeSubmenu === submenu;
  }
} 