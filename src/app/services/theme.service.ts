import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    // التحقق من الـ URL عند بداية التحميل
    this.checkDarkModeByUrl();
  }

  checkDarkModeByUrl(): void {
    // التحقق إذا كان الـ URL يحتوي على http://localhost:4200/
    const isLocalhost = window.location.href.includes('http://localhost:4200/');
    const savedTheme = localStorage.getItem('theme');

    // إذا كان الـ URL هو localhost:4200، يتم تفعيل الدارك مود
    if (isLocalhost) {
      this.setDarkMode(true);
    } else if (savedTheme) {
      // إذا كان فيه إعداد محفوظ في localStorage
      this.setDarkMode(savedTheme === 'dark');
    } else {
      this.setDarkMode(false);
    }
  }

  toggleDarkMode(): void {
    const currentMode = this.isDarkMode.value;
    this.setDarkMode(!currentMode);
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode.next(isDark);
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }
}