import { Component, inject } from '@angular/core';
import { ContactsApi } from '../api';
import { ContactsListComponent } from '../contacts-list/contacts-list';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.html',
  styleUrls: ['./contacts-page.css'],
  imports: [ContactsListComponent],
})
export class ContactsPageComponent {
  protected api = inject(ContactsApi);
}
