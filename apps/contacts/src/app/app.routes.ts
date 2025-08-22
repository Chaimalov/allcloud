import { Route } from '@angular/router';
import { ContactDetailsPageComponent } from './contact-details-page/contact-details-page';
import { ContactsPageComponent } from './contacts-page/contacts-page';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contacts',
  },
  {
    path: 'contacts',
    component: ContactsPageComponent,
  },
  {
    path: 'contacts/new',
    component: ContactDetailsPageComponent,
  },
  {
    path: 'contacts/:id',
    component: ContactDetailsPageComponent,
  },
];
