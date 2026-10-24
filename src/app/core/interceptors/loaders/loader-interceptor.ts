import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../../auth/services/interceptors/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  loaderService.loading.set(true);
  return next(req).pipe(
    finalize(() => {
      loaderService.loading.set(false);
    }),
  );
};
