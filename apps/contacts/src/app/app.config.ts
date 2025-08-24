import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition, to }) => {
          if (to.firstChild?.title === 'Contacts') {
            document.documentElement.classList.add('back-transition');
            transition.finished.then(() => {
              document.documentElement.classList.remove('back-transition');
            });
          }
        },
      }),
    ),
    provideHttpClient(),
  ],
};
