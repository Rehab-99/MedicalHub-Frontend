import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor() {
    // Initialize dark mode from localStorage or default to false
    const savedMode = localStorage.getItem('darkMode');
    const isDark = savedMode ? JSON.parse(savedMode) : false;
    this.isDarkModeSubject.next(isDark);
    if (isDark) {
      document.body.classList.add('dark-mode');
    }
  }

  toggleDarkMode(): void {
    const newMode = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  }

  getDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}