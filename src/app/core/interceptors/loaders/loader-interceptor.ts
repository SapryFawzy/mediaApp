import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../../Service/interceptors/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  if (!req.url.includes('search')) {
    loaderService.loading.set(true);
  }
  return next(req).pipe(
    finalize(() => {
      loaderService.loading.set(false);
    }),
  );
};
