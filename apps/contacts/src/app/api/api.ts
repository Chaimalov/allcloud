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

    return this.http.put<Contact>(`${SERVER_URL}/${contact.id}`, contact).pipe(
      takeUntil(abortSubject.subject),
      retryOnReconnect(),
      finalize(() => {
        updatedContact.pendingRequest?.()?.complete();
        updatedContact.pendingRequest?.set(undefined);
      }),
    );
  }

  private createContact(contact: NewContact): Observable<Contact> {
    const abortSubject = new AbortSubject();

    const newContact: Contact = {
      ...contact,
      id: v4(),
      pendingRequest: signal(abortSubject),
    };

    this.contacts.update((contacts) => [...contacts, newContact]);

    return this.http.post<Contact>(SERVER_URL, newContact).pipe(
      retryOnReconnect(),
      finalize(() => {
        newContact.pendingRequest?.()?.complete();
        newContact.pendingRequest?.set(undefined);
      }),
    );
  }
}
