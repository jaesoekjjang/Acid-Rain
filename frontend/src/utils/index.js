import { Observable } from "rxjs";
import { map, switchMap, takeUntil, tap } from "rxjs/operators";

export const loadText = async (path) => {
  const text = await (await fetch(path)).text();
  return text;
};

export const randomBetween = (min, max) => {
  return min + Math.random() * (max - min);
};

export function pausable(pause$) {
  return (source) => {
    return new Observable((observer) => {
      let paused = false;

      const subscription = source.subscribe((val) => {
        if (paused) return;
        observer.next(val);
      });

      const pauseSubscription = pause$.subscribe(
        (pausedValue) => (paused = pausedValue)
      );

      return () => {
        subscription.unsubscribe();
        pauseSubscription.unsubscribe();
      };
    });
  };
}

//TODO Validator
// const score = 100;
// const name = "jaesoek";

// const nameValidation$ = of(name).pipe(
//   mergeMap((value) =>
//     iif(
//       () => /\d/.test(value),
//       of({ value }),
//       of({ value, msg: "validation error" })
//     )
//   )
// );

// const scoreValidation$ = of(score).pipe(
//   mergeMap((value) =>
//     iif(
//       () => /\d/.test(value),
//       of({ value, error }),
//       of({ value, msg: "validation error" })
//     )
//   )
// );

// const validation$ = combineLatest(nameValidation$, scoreValidation$).subscribe(
//   console.log
// );
