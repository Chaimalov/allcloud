import { Contact, CONTACT_FIELDS } from '@allcloud/contacts';
import { HttpClient, httpResource } from '@angular/common/http';
import { effect, inject, Injectable, resource } from '@angular/core';
import { firstValueFrom, forkJoin, Observable, switchMap } from 'rxjs';

const RANDOM_GENERATION_AMOUNT = 5;
const INCLUDE_FIELDS = CONTACT_FIELDS.join(',');

@Injectable({
  providedIn: 'root',
})
export class ContactsApi {
  private http = inject(HttpClient);

  public contacts = httpResource<Contact[]>(
    () => 'http://localhost:3000/api/contacts'
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

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`http://localhost:3000/api/contacts/${id}`);
  }

  deleteContact(id: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`http://localhost:3000/api/contacts/${id}`)
    );
  }

  saveContact(contact: Contact): Observable<Contact> {
    if (contact.id) {
      return this.http.put<Contact>(
        `http://localhost:3000/api/contacts/${contact.id}`,
        contact
      );
    } else {
      return this.http.post<Contact>(
        'http://localhost:3000/api/contacts',
        contact
      );
    }
  }
}
