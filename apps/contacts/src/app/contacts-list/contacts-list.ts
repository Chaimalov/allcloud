import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ContactsApi } from '../api/api';
import { ContactItemComponent } from '../contact-item/contact-item';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.html',
  styleUrls: ['./contacts-list.css'],
  imports: [ContactItemComponent, KeyValuePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsListComponent {
  protected api = inject(ContactsApi);

  protected groupedContacts = computed(() =>
    Object.groupBy(
      this.api.contacts
        .value()
        .toSorted(
          (a, b) => a.name?.last?.localeCompare(b.name?.last ?? '') ?? 0,
        ),
      (contact) => contact.name?.last?.at(0)?.toUpperCase() ?? '',
    ),
  );
}
