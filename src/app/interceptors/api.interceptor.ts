import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // Clone the request and add the authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API Error:', error);

      if (error.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.status === 403) {
        // Handle forbidden access
        Swal.fire('Error', 'You do not have permission to perform this action', 'error');
      } else {
        // Handle other errors
        Swal.fire('Error', 'An error occurred while processing your request', 'error');
      }

      return throwError(() => error);
    })
  );
}; 