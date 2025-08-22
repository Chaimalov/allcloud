import { Contact, CONTACT_FIELDS, NewContact } from '@allcloud/contacts';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
  httpResource,
} from '@angular/common/http';
import { effect, inject, Injectable, resource } from '@angular/core';
import {
  firstValueFrom,
  forkJoin,
  fromEvent,
  map,
  merge,
  Observable,
  switchMap,
} from 'rxjs';
import { RequestQueue } from './request-queue';

const RANDOM_GENERATION_AMOUNT = 5;
const INCLUDE_FIELDS = CONTACT_FIELDS.join(',');

@Injectable({
  providedIn: 'root',
})
export class ContactsApi {
  private queue = inject(RequestQueue);
  private http = inject(HttpClient);

  public contacts = httpResource<Contact[]>(
    () => 'http://localhost:3000/api/contacts',
    {
      defaultValue: [],
    }
  );

  public loadRandomContacts(
    amount = RANDOM_GENERATION_AMOUNT
  ): Promise<Contact[]> {
    const url = `https://randomuser.me/api/?results=${amount}&inc=${INCLUDE_FIELDS}&noinfo`;

    return firstValueFrom(
      this.http.get<{ results: Contact[] }>(url).pipe(
        switchMap((response) => {
          return forkJoin(
            response.results.map((contact) => {
              return this.http.post<Contact>(
                'http://localhost:3000/api/contacts',
                contact
              );
            })
          );
        })
      )
    );
  }

  public async getContact(id: number): Promise<Contact | undefined> {
    if (!navigator.onLine) {
      return this.contacts.value().find((contact) => contact.id === id);
    }

    return firstValueFrom(
      this.http.get<Contact | undefined>(
        `http://localhost:3000/api/contacts/${id}`
      )
    );
  }

  deleteContact(id: number): Promise<void> {
    this.contacts.update((contacts) =>
      contacts.filter((contact) => contact.id !== id)
    );

    return firstValueFrom(
      this.queue.request(
        this.http.delete<void>(`http://localhost:3000/api/contacts/${id}`)
      )
    );
  }

  saveContact(contact: Contact | NewContact): Observable<Contact> {
    if ('id' in contact) {
      this.contacts.update((contacts) =>
        contacts.map((c) => (c.id === contact.id ? { ...c, ...contact } : c))
      );

      return this.queue.request(
        this.http.put<Contact>(
          `http://localhost:3000/api/contacts/${contact.id}`,
          contact
        )
      );
    } else {
      this.contacts.update((contacts) => [
        ...contacts,
        { ...contact, id: Date.now() },
      ]);

      return this.queue.request(
        this.http.post<Contact>(`http://localhost:3000/api/contacts`, contact)
      );
    }
  }
}
