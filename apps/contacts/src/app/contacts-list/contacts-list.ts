import { Component, computed, inject } from '@angular/core';
import { ContactsApi } from '../api';
import { ContactItemComponent } from '../contact-item/contact-item';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.html',
  styleUrls: ['./contacts-list.css'],
  imports: [ContactItemComponent],
})
export class ContactsListComponent {
  protected api = inject(ContactsApi);

  protected sortedContacts = computed(() =>
    this.api.contacts
      .value()
      ?.sort((a, b) => a.name?.last?.localeCompare(b.name?.last ?? '') ?? 0)
  );
}
