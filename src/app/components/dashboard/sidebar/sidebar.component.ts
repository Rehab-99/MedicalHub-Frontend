import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  menuItems = [
    {
      title: 'Dashboard',
      icon: 'fas fa-home',
      route: '/dashboard'
    },
    {
      title: 'Categories',
      icon: 'fas fa-th-list',
      children: [
        { title: 'Human Categories', route: '/dashboard/human-categories', icon: 'fas fa-user' },
        { title: 'Vet Categories', route: '/dashboard/vet-categories', icon: 'fas fa-paw' }
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
      title: 'Pharmacy',
      icon: 'fas fa-pills',
      children: [
        { title: 'Human Pharmacy', route: '/dashboard/human-pharmacy', icon: 'fas fa-user' },
        { title: 'Vet Pharmacy', route: '/dashboard/vet-pharmacy', icon: 'fas fa-paw' }
      ]
    },
    {
      title: 'Clinics',
      icon: 'fas fa-hospital',
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
      title: 'Services',
      icon: 'fas fa-hand-holding-medical',
      route: '/dashboard/services'
    },
    {
      title: 'BookedServices',
      icon: 'fas fa-hand-holding-medical',
      route: '/dashboard/bookedservices'
    },
    {
      title: 'Doctor-Requests',
      icon: 'fas fa-user-md',
      route: '/dashboard/doctor-request'
    },
    {
      title: 'Coupons',
      icon: 'fas fa-ticket-alt',
      route: '/dashboard/coupons'
    },
    {
      title: 'Users',
      icon: 'fas fa-user-cog',
      route: '/dashboard/users'
    },
    {
      title: 'Orders',
      icon: 'fas fa-shopping-cart',
      route: '/dashboard/orders'
    },
  ];

  expandedMenus: { [key: string]: boolean } = {};

  toggleMenu(title: string) {
    this.expandedMenus[title] = !this.expandedMenus[title];
  }

  isMenuExpanded(title: string): boolean {
    return this.expandedMenus[title] || false;
  }
} 