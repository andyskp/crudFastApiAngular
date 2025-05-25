import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    RouterOutlet,    // <— Agrega aquí el provider de HttpClient
  ],
};
