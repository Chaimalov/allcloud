import { Contact } from '@allcloud/contacts';
import { Subject } from 'rxjs';

export class AbortSubject {
   #subject = new Subject<void>();

   public subject = this.#subject.asObservable();

   public abort(): void {
      this.#subject.next();
      this.#subject.complete();
   }
}

export interface PendingSyncContact extends Contact {
   pendingRequest?: AbortSubject;
}
