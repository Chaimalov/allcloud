import { Contact } from '@allcloud/contacts';
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { ContactItemComponent } from '../contact-item/contact-item';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.html',
  styleUrls: ['./contacts-list.css'],
  imports: [ContactItemComponent],
})
export class ContactsListComponent {
  protected contacts = httpResource<Contact[]>(
    () => 'http://localhost:3000/api/contacts'
  );
}
