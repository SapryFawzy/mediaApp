import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      toastrService.error(error.error.message, 'Error');
      if (error.error.message === 'token not provided') {
        localStorage.clear();
        setTimeout(() => {
          router.navigate(['/login']);
        }, 3000);
      }
      return throwError(() => error);
    }),
  );
};
