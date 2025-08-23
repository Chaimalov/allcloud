import { Contact, CONTACT_FIELDS, NewContact } from '@allcloud/contacts';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
   finalize,
   firstValueFrom,
   forkJoin,
   Observable,
   Subject,
   switchMap,
   takeUntil,
   tap,
} from 'rxjs';
import { retryOnReconnect } from './replay-on-reconnect';
import { AbortSubject, PendingSyncContact } from './abort-subject';

const RANDOM_GENERATION_AMOUNT = 5;
const INCLUDE_FIELDS = CONTACT_FIELDS.join(',');

@Injectable({
   providedIn: 'root',
})
export class ContactsApi {
   private http = inject(HttpClient);

   public contacts = httpResource<Array<Contact | PendingSyncContact>>(
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
            tap((response) => {
               this.contacts.update((contacts) => [
                  ...contacts,
                  ...response.results,
               ]);
            }),
            switchMap((response) => {
               return forkJoin(
                  response.results.map((contact) => {
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

   public async getContact(id: number): Promise<Contact | undefined> {
      if (!navigator.onLine) {
         return this.contacts.value().find((contact) => contact.id === id);
      }

      return firstValueFrom(
         this.http.get<Contact | undefined>(
            `http://localhost:3000/api/contacts/${id}`,
         ),
      );
   }

   public deleteContact(id: number): Promise<void> {
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
      const abortSubject = new AbortSubject();

      const updatedContact: PendingSyncContact = {
         ...contact,
         pendingRequest: abortSubject,
      };

      this.contacts.update((contacts) =>
         contacts.map((c) =>
            c.id === contact.id ? { ...c, ...updatedContact } : c,
         ),
      );

      return this.http
         .put<Contact>(
            `http://localhost:3000/api/contacts/${contact.id}`,
            contact,
         )
         .pipe(
            takeUntil(abortSubject.subject),
            retryOnReconnect(),
            finalize(() => {
               updatedContact.pendingRequest?.abort();
               delete updatedContact.pendingRequest;
            }),
         );
   }

   private createContact(contact: NewContact): Observable<Contact> {
      const abortSubject = new AbortSubject();

      const newContact: PendingSyncContact = {
         ...contact,
         pendingRequest: abortSubject,
         id: Date.now(),
      };

      this.contacts.update((contacts) => [...contacts, newContact]);

      return this.http
         .post<Contact>(`http://localhost:3000/api/contacts`, contact)
         .pipe(
            takeUntil(abortSubject.subject),
            retryOnReconnect(),
            finalize(() => {
               newContact.pendingRequest?.abort();
               delete newContact.pendingRequest;
            }),
         );
   }
}
