import { signal, WritableSignal } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

export interface PendingRequest<T> {
  request$: Observable<T>;
  pending: WritableSignal<Subscription | undefined>;
  cancel: () => void;
}

export function withPendingRequest<T>(
  source$: Observable<T>,
  existing?: WritableSignal<Subscription | undefined>,
): PendingRequest<T> {
  const response = new Subject<T>();
  const pending = existing ?? signal<Subscription | undefined>(undefined);

  pending()?.unsubscribe();

  const subscription = source$
    .pipe(
      finalize(() => {
        response.complete();
        pending.set(undefined);
      }),
    )
    .subscribe({
      next: (value) => response.next(value),
      error: (err) => response.error(err),
    });

  pending.set(subscription);

  return {
    request$: response.asObservable(),
    pending,
    cancel: () => {
      pending()?.unsubscribe();
      pending.set(undefined);
    },
  };
}
