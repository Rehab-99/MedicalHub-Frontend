import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Check for token and user data in URL after Google login
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userData = params['user'];
      
      if (token && userData) {
        try {
          // Parse user data
          const user = JSON.parse(decodeURIComponent(userData));
          
          // Set token and user data
          this.authService.setToken(token);
          this.authService.setUser(user);
          
          // Show success message
          this.toastService.success('Successfully logged in!');
          
          // Remove parameters from URL
          this.router.navigate([], { 
            queryParams: { token: null, user: null },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.toastService.error('Error logging in. Please try again.');
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
