import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;

  // ✅ Only access localStorage if in the browser
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    token = localStorage.getItem('token');
  }

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

      if (typeof window !== 'undefined') {
        if (error.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (error.status === 403) {
          Swal.fire('Error', 'You do not have permission to perform this action', 'error');
        } else {
          Swal.fire('Error', 'An error occurred while processing your request', 'error');
        }
      }

      return throwError(() => error);
    })
  );
};
