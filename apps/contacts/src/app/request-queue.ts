import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  retry,
  take,
  throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestQueue {
  private http = inject(HttpClient);
  private isOnline = merge(
    fromEvent(window, 'online').pipe(map(() => true)),
    fromEvent(window, 'offline').pipe(map(() => false))
  );

  public request<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      retry({
        delay: (error) => {
          if (!navigator.onLine) {
            return this.isOnline.pipe(filter(Boolean), take(1));
          }
          return throwError(() => error);
        },
      })
    );
  }
}
