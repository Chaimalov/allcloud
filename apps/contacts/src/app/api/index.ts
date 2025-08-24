export * from './api';
export * from './replay-on-reconnect';

import type { WritableSignal } from '@angular/core';
import type { Subscription } from 'rxjs';
import type { Contact as ContactInfo } from '@allcloud/contacts';

export type Contact = ContactInfo & {
  pendingRequest?: WritableSignal<Subscription | undefined>;
};
