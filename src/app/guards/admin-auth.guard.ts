import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const adminToken = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');
      
      if (!adminToken || !adminData) {
        this.router.navigate(['/admin/login']);
        return false;
      }

      try {
        const admin = JSON.parse(adminData);
        if (!admin.role) {
          this.router.navigate(['/admin/login']);
          return false;
        }
        return true;
      } catch (error) {
        this.router.navigate(['/admin/login']);
        return false;
      }
    }
    return false;
  }
} 