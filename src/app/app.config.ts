import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptors/headers/header-interceptor';
import { loaderInterceptor } from './core/interceptors/loaders/loader-interceptor';
import { errorInterceptor } from './core/interceptors/error/error-interceptor';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation(), withInMemoryScrolling(), withViewTransitions()),
    provideHttpClient(
      withFetch(),
      withInterceptors([headerInterceptor, loaderInterceptor, errorInterceptor]),
    ),
  ],
};
