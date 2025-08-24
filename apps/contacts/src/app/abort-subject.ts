import { Contact as ContactInfo } from '@allcloud/contacts';
import { Signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';

export class AbortSubject {
  #subject = new Subject<void>();

  public subject = this.#subject.asObservable();

  public abort(): void {
    this.#subject.next();
    this.#subject.complete();
  }

  public complete(): void {
    this.#subject.complete();
  }
}

export interface Contact extends ContactInfo {
  pendingRequest?: WritableSignal<AbortSubject | undefined>;
}
