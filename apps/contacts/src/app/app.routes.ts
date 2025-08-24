import { Route } from '@angular/router';
import { ContactDetailsComponent } from './contact-details/contact-details';
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
    component: ContactDetailsComponent,
  },
  {
    path: 'contacts/:id',
    component: ContactDetailsComponent,
  },
];
