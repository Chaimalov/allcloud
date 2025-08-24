import {
  fromEvent,
  map,
  MonoTypeOperatorFunction,
  Observable,
  retry,
  share,
  throwError,
} from 'rxjs';

const online = fromEvent(window, 'online').pipe(
  map(() => true),
  share()
);

export function retryOnReconnect<T>(): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.pipe(
      retry({
        delay: (error) => {
          if (!navigator.onLine) {
            return online;
          }
          return throwError(() => error);
        },
      })
    );
}
