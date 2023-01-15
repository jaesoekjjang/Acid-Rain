import {
  fromEvent,
  BehaviorSubject,
  tap,
  interval,
  switchMap,
  timeInterval,
  mergeMap,
  map,
  scan,
  timestamp,
  filter,
  mergeScan,
  of,
  timeout,
  startWith,
  take,
} from "rxjs";

import { ajax } from "rxjs/ajax";

const INTERVAL = 2000;
const TIME_LIMIT = 10000;

export const setupCounter = (element) => {
  const counter = new BehaviorSubject(0);

  const setInnerHTML = (value) => (element.innerHTML = `count is ${value}`);

  fromEvent(element, "click")
    .pipe(tap(() => counter.next(counter.getValue() + 1)))
    .subscribe(() => setInnerHTML(counter.getValue()));

  setInnerHTML(counter.getValue());
};

export const decreasingInterval = () => {
  const interval$ = new BehaviorSubject(1);

  return interval$.pipe(
    switchMap(() => interval(interval$.getValue() * TIME_LIMIT)),
    tap((_) => interval$.next(interval$.getValue() * 0.999))
  );
};

const words = new BehaviorSubject([]);

// decreasingInterval()
//   .pipe(
//     mergeMap(() => ajax("https://randomuser.me/api")),
//     map((x) => x?.response?.results[0]?.name?.first),
//     timestamp(),
//     tap((x) => console.log(Date.now(), x)),

//     // tap(_ => words.next([...words.getValue(), x]))
//     scan((acc, x) => [...acc, x], [])
//   )
//   .subscribe((w) => {
//     console.log(w);
// const $names = document.querySelector(".names");

// const $li = document.createElement("li");
// const $div = document.createElement("div");
// $div.innerText = w;

// $li.appendChild($div);
// $names.appendChild($li);
// });

// export const inputListener = (element) => {
//   fromEvent(element, "keyup")
//     .pipe(
//       map((x) => x.code),
//       filter((x) => {
//         return Date.now() - x.timestamp < TIME_LIMIT;
//       })
//     )
//     .subscribe();
// };

const words$ = new BehaviorSubject({});

const click$ = fromEvent(document, "click");

const interval$ = interval(INTERVAL);
const word$ = interval$.pipe(
  mergeMap(() => ajax("https://randomuser.me/api")),
  map((x) => x?.response?.results[0]?.name?.first),
  timestamp(),
  tap((x) => words$.next({ ...words$.getValue(), [x.value]: x })),
  tap((x) => {
    const words = words$.getValue();
    const timeoverWords = Object.values(words).filter(
      ({ timestamp }) => Date.now() - timestamp > TIME_LIMIT
    );
    if (timeoverWords.length > 0) {
      const copy = { ...words };
      timeoverWords.forEach(({ value }) => delete copy[value]);
      words$.next(copy);
    }
  })
);

word$.subscribe();
const input$ = fromEvent(document.querySelector("input"), "keyup").pipe(
  map((x) => x?.target?.value),
  tap((x) => {
    const words = words$.getValue();
    if (x in words) {
      const copy = { ...words };
      delete copy[x];
      words$.next(copy);
      document.querySelector("input").value = "";
    }
  })
);

input$.subscribe();

words$.subscribe((words) => {
  document.querySelector("ul").innerHTML = Object.keys(words).reduce(
    (acc, word) => acc + `<li>${word}</li>`,
    ""
  );
});
