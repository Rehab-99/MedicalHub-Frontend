import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent {
  menuItems = [
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/dashboard'
    },
    {
      title: 'Appointments',
      icon: 'fas fa-calendar-check',
      route: '/dashboard/appointments'
    },
    {
      title: 'Doctors',
      icon: 'fas fa-user-md',
      route: '/dashboard/doctors'
    },
    {
      title: 'Patients',
      icon: 'fas fa-users',
      route: '/dashboard/patients'
    },
    {
      title: 'Consultations',
      icon: 'fas fa-stethoscope',
      route: '/dashboard/consultations'
    },
    {
      title: 'Categories',
      icon: 'fas fa-tags',
      children: [
        { title: 'Human Category', route: '/dashboard/categories/type/human', icon: 'fas fa-user' },
        { title: 'Vet Category', route: '/dashboard/categories/type/vet', icon: 'fas fa-paw' }
      ]
    },
    {
      title: 'Products',
      icon: 'fas fa-box',
      children: [
        { title: 'Human Products', route: '/dashboard/human-products', icon: 'fas fa-user' },
        { title: 'Vet Products', route: '/dashboard/vet-products', icon: 'fas fa-paw' }
      ]
    },
    {
      title: 'Pharmacy',
      icon: 'fas fa-pills',
      children: [
        { title: 'Human Pharmacy', route: '/dashboard/human-pharmacy', icon: 'fas fa-user' },
        { title: 'Vet Pharmacy', route: '/dashboard/vet-pharmacy', icon: 'fas fa-paw' }
      ]
    },
    {
      title: 'Clinics',
      icon: 'fas fa-clinic-medical',
      children: [
        { title: 'Human Clinic', route: '/dashboard/human-clinic', icon: 'fas fa-user' },
        { title: 'Vet Clinic', route: '/dashboard/vet-clinic', icon: 'fas fa-paw' }
      ]
    },
    {
      title: 'Blog',
      icon: 'fas fa-blog',
      children: [
        { title: 'Human Blog', route: '/dashboard/human-blog', icon: 'fas fa-user' },
        { title: 'Vet Blog', route: '/dashboard/vet-blog', icon: 'fas fa-paw' }
      ]
    },
    {
      title: 'Users',
      icon: 'fas fa-user-cog',
      route: '/dashboard/users'
    },
    {
      title: 'Settings',
      icon: 'fas fa-cog',
      route: '/dashboard/settings'
    }
  ];

  expandedMenus: { [key: string]: boolean } = {};

  toggleMenu(title: string) {
    // Close all other menus first
    Object.keys(this.expandedMenus).forEach(key => {
      if (key !== title) {
        this.expandedMenus[key] = false;
      }
    });
    // Toggle the clicked menu
    this.expandedMenus[title] = !this.expandedMenus[title];
  }

  isMenuExpanded(title: string): boolean {
    return this.expandedMenus[title] || false;
  }
} 