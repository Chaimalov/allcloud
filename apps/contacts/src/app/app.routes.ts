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
    title: 'Contacts',
  },
  {
    path: 'contacts/new',
    component: ContactDetailsComponent,
    title: 'New contact',
  },
  {
    path: 'contacts/:id',
    component: ContactDetailsComponent,
    title: 'Contact details',
  },
];
