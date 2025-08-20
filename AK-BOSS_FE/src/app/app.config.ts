import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { AppInterceptor } from './core/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
    provideAnimations(),
    ToastrModule,
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(appRoutes), provideHttpClient(withFetch(),withInterceptors([AppInterceptor])),provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
      preventDuplicates: true,
    }), ]
};
