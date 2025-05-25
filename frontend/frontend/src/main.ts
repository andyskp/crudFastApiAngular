import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    // hereda los providers de appConfig
    ...(appConfig.providers ?? []),
    // añade el provider de HttpClient
    provideHttpClient(),
  ],
})
.catch((err) => console.error(err));
