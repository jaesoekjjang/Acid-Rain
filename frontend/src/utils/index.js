import { Observable } from "rxjs";
import { map, switchMap, takeUntil, tap } from "rxjs/operators";

export const loadText = async (path) => {
  const text = await (await fetch(path)).text();
  return text;
};

export function pausable(pause$) {
  return (source) => {
    const resume$ = pause$.pipe(takeUntil(source));

    return new Observable((observer) => {
      let paused = false;

      const subscription = source.subscribe({
        next(value) {
          if (!paused) {
            observer.next(value);
          }
        },
        error(error) {
          observer.error(error);
        },
        complete() {
          observer.complete();
        },
      });

      pause$.subscribe((pausedValue) => {
        paused = pausedValue;
      });

      resume$.subscribe(() => {
        paused = false;
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  };
}
