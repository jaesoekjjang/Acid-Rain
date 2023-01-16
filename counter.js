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
  timer,
} from "rxjs";

import { ajax } from "rxjs/ajax";

// // export const setupCounter = (element) => {
// //   const counter = new BehaviorSubject(0);

// //   const setInnerHTML = (value) => (element.innerHTML = `count is ${value}`);

// //   fromEvent(element, "click")
// //     .pipe(tap(() => counter.next(counter.getValue() + 1)))
// //     .subscribe(() => setInnerHTML(counter.getValue()));

// //   setInnerHTML(counter.getValue());
// // };

// // export const decreasingInterval = () => {
// //   const interval$ = new BehaviorSubject(1);

// //   return interval$.pipe(
// //     switchMap(() => interval(interval$.getValue() * TIME_LIMIT)),
// //     tap((_) => interval$.next(interval$.getValue() * 0.999))
// //   );
// // };

// // const words = new BehaviorSubject([]);

// // decreasingInterval()
// //   .pipe(
// //     mergeMap(() => ajax("https://randomuser.me/api")),
// //     map((x) => x?.response?.results[0]?.name?.first),
// //     timestamp(),
// //     tap((x) => console.log(Date.now(), x)),

// //     // tap(_ => words.next([...words.getValue(), x]))
// //     scan((acc, x) => [...acc, x], [])
// //   )
// //   .subscribe((w) => {
// //     console.log(w);
// // const $names = document.querySelector(".names");

// // const $li = document.createElement("li");
// // const $div = document.createElement("div");
// // $div.innerText = w;

// // $li.appendChild($div);
// // $names.appendChild($li);
// // });

// // export const inputListener = (element) => {
// //   fromEvent(element, "keyup")
// //     .pipe(
// //       map((x) => x.code),
// //       filter((x) => {
// //         return Date.now() - x.timestamp < TIME_LIMIT;
// //       })
// //     )
// //     .subscribe();
// // };

const difficultyMap = {
  1: [3000, 10000],
  2: [2000, 7000],
  3: [1500, 5000],
  4: [1500, 3000],
};

export function init(difficulty = 2) {
  const [INTERVAL, TIME_LIMIT] = difficultyMap[difficulty];

  const subscriptions = [];

  const words$ = new BehaviorSubject({});
  const life$ = new BehaviorSubject(1);

  const word$ = interval(INTERVAL).pipe(
    mergeMap(() => ajax("https://randomuser.me/api")),
    map((x) => x?.response?.results[0]?.name?.first),
    tap((x) => {
      words$.next({ ...words$.getValue(), [x]: x });
      timer(TIME_LIMIT).subscribe(() => {
        const words = words$.getValue();
        if (x in words) {
          life$.next(life$.getValue() - 1);
          const wordsCopy = { ...words };
          delete wordsCopy[x];
          words$.next(wordsCopy);
        }
      });
    })
  );

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

  const wordSubscription = word$.subscribe();
  const inputSubscription = input$.subscribe();
  const wordsSubscription = words$.subscribe((words) => {
    document.querySelector(".words-list").innerHTML = Object.keys(words).reduce(
      (acc, word) => acc + `<li>${word}</li>`,
      ""
    );
  });
  const lifeSubscription = life$.subscribe((life) => {
    document.querySelector(".life").innerHTML = life;
    if (life <= 0) {
      gameOver();
      return;
    }
  });

  subscriptions.push(
    wordSubscription,
    inputSubscription,
    wordsSubscription,
    lifeSubscription
  );

  function unSubscribe() {
    subscriptions.forEach((s) => s.unsubscribe());
  }

  function gameOver() {
    unSubscribe();
    showGameOver();
  }

  function showGameOver() {
    document.querySelector(".game-over__panel").classList.remove("play");
  }
}
