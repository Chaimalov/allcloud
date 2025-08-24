import { CONTACT_FIELDS, NewContact } from '@allcloud/contacts';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { v4 } from 'uuid';
import {
  finalize,
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AbortSubject, Contact } from './abort-subject';
import { retryOnReconnect } from './replay-on-reconnect';

const RANDOM_GENERATION_AMOUNT = 5;
const INCLUDE_FIELDS = CONTACT_FIELDS.join(',');

@Injectable({
  providedIn: 'root',
})
export class ContactsApi {
  private http = inject(HttpClient);

  public contacts = httpResource<Array<Contact>>(
    () => 'http://localhost:3000/api/contacts',
    {
      defaultValue: [],
    },
  );

  public generateRandomContacts(
    amount = RANDOM_GENERATION_AMOUNT,
  ): Promise<Contact[]> {
    const url = `https://randomuser.me/api/?results=${amount}&inc=${INCLUDE_FIELDS}&noinfo`;

    return firstValueFrom(
      this.http.get<{ results: Contact[] }>(url).pipe(
        map((response) =>
          response.results.map((contact) => ({ ...contact, id: v4() })),
        ),
        tap((results) => {
          document.startViewTransition(() => {
            this.contacts.update((contacts) => [...contacts, ...results]);
          });
        }),
        switchMap((results) => {
          return forkJoin(
            results.map((contact) => {
              return this.http.post<Contact>(
                'http://localhost:3000/api/contacts',
                contact,
              );
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
      this.http.get<Contact | undefined>(
        `http://localhost:3000/api/contacts/${id}`,
      ),
    );
  }

  public deleteContact(id: string): Promise<void> {
    this.contacts.update((contacts) =>
      contacts.filter((contact) => contact.id !== id),
    );

    return firstValueFrom(
      this.http
        .delete<void>(`http://localhost:3000/api/contacts/${id}`)
        .pipe(retryOnReconnect()),
    );
  }

  public saveContact(contact: Contact | NewContact): Observable<Contact> {
    return 'id' in contact
      ? this.updateContact(contact)
      : this.createContact(contact);
  }

  private updateContact(contact: Contact): Observable<Contact> {
    contact.pendingRequest?.()?.abort();

    const abortSubject = new AbortSubject();

    const updatedContact: Contact = {
      ...contact,
      pendingRequest: signal(abortSubject),
    };

    this.contacts.update((contacts) =>
      contacts.map((c) =>
        c.id === contact.id ? { ...c, ...updatedContact } : c,
      ),
    );

    return this.http
      .put<Contact>(`http://localhost:3000/api/contacts/${contact.id}`, contact)
      .pipe(
        takeUntil(abortSubject.subject),
        retryOnReconnect(),
        finalize(() => {
          updatedContact.pendingRequest?.()?.complete();
          updatedContact.pendingRequest?.set(undefined);
        }),
      );
  }

  private createContact(contact: NewContact): Observable<Contact> {
    this.contacts.update((contacts) => [...contacts, { ...contact, id: v4() }]);

    return this.http
      .post<Contact>(`http://localhost:3000/api/contacts`, contact)
      .pipe(retryOnReconnect());
  }
}
