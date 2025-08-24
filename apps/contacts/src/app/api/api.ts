import { CONTACT_FIELDS } from '@allcloud/contacts';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  finalize,
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { v4 } from 'uuid';
import { Contact } from '.';
import { retryOnReconnect } from './replay-on-reconnect';
import { withPendingRequest } from './pending-request';

const RANDOM_GENERATION_AMOUNT = 5;
const INCLUDE_FIELDS = CONTACT_FIELDS.join(',');

const SERVER_URL = 'http://localhost:3000/api/contacts';

@Injectable({
  providedIn: 'root',
})
export class ContactsApi {
  private http = inject(HttpClient);

  public contacts = httpResource<Array<Contact>>(() => SERVER_URL, {
    defaultValue: [],
  });

  public generateRandomContacts(
    amount = RANDOM_GENERATION_AMOUNT,
  ): Promise<Contact[]> {
    const url = `https://randomuser.me/api/1.4/?results=${amount}&inc=${INCLUDE_FIELDS}&noinfo`;

    return firstValueFrom(
      this.http.get<{ results: Contact[] }>(url).pipe(
        map((response) =>
          response.results.map((contact) => ({ ...contact, id: v4() })),
        ),
        tap((results) => {
          this.contacts.update((contacts) => [...contacts, ...results]);
        }),
        switchMap((results) => {
          return forkJoin(
            results.map((contact) => {
              return this.http.post<Contact>(SERVER_URL, contact);
            }),
          );
        }),
        retryOnReconnect(),
      ),
    );
  }

  public async getContact(id: string): Promise<Contact | undefined> {
    if (!navigator.onLine) {
      return this.contacts.value().find((contact) => contact.id === id);
    }

    return firstValueFrom(
      this.http.get<Contact | undefined>(`${SERVER_URL}/${id}`),
    );
  }

  public deleteContact(id: string): Promise<void> {
    this.contacts.update((contacts) =>
      contacts.filter((contact) => contact.id !== id),
    );

    return firstValueFrom(
      this.http.delete<void>(`${SERVER_URL}/${id}`).pipe(retryOnReconnect()),
    );
  }

  public saveContact(contact: Contact): Observable<Contact> {
    return 'id' in contact
      ? this.updateContact(contact)
      : this.createContact(contact);
  }

  private updateContact(contact: Contact): Observable<Contact> {
    const { request$, pending } = withPendingRequest(
      this.http
        .put<Contact>(`${SERVER_URL}/${contact.id}`, contact)
        .pipe(retryOnReconnect()),
      contact.pendingRequest,
    );

    this.contacts.update((contacts) =>
      contacts.map((c) =>
        c.id === contact.id ? { ...contact, pendingRequest: pending } : c,
      ),
    );

    return request$;
  }

  private createContact(contact: Omit<Contact, 'id'>): Observable<Contact> {
    const newContact: Contact = {
      ...contact,
      id: v4(),
    };

    const { request$, pending } = withPendingRequest(
      this.http.post<Contact>(SERVER_URL, newContact).pipe(retryOnReconnect()),
    );

    this.contacts.update((contacts) => [
      ...contacts,
      {
        ...newContact,
        pendingRequest: pending,
      },
    ]);

    return request$;
  }
}
