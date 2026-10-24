import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['signup', 'signin'];
  let isExcluded = excludedUrls.some((path) => {
    return req.url.includes(path);
  });

  if (isExcluded) {
    return next(req);
  }

  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return next(req);
};
