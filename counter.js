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

const difficultyMap = {
  1: [3000, 10000, 3],
  2: [2000, 7000, 3],
  3: [1500, 5000, 3],
  4: [1500, 3000, 1],
};

export function init(difficulty = 2, wordsList) {
  const $form = document.querySelector("form");
  const $words = document.querySelector(".words-list");
  const $life = document.querySelector(".life");

  const [INTERVAL, TIME_LIMIT, MAX_LIFE] = difficultyMap[difficulty];
  const words$ = new BehaviorSubject({});
  const life$ = new BehaviorSubject(MAX_LIFE);
  const subscriptions = [];

  const word$ = interval(INTERVAL).pipe(
    map((x) => wordsList[x]),
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

  const input$ = fromEvent($form, "submit").pipe(
    tap((e) => e.preventDefault()),
    map((x) => x?.target?.querySelector(".input")),
    tap((x) => {
      const { value } = x;
      const words = words$.getValue();
      if (value in words) {
        const copy = { ...words };
        delete copy[value];
        words$.next(copy);
        $form.reset();
      }
    })
  );

  const wordSubscription = word$.subscribe();
  const inputSubscription = input$.subscribe();
  const wordsSubscription = words$.subscribe((words) => {
    $words.innerHTML = Object.keys(words).reduce(
      (acc, word) => acc + `<li>${word}</li>`,
      ""
    );
  });

  const lifeSubscription = life$.subscribe((life) => {
    $life.innerHTML = "❤️".repeat(life);
    if (life <= 0) {
      gameOver();
      return;
    }
  });

  function gameOver() {
    unSubscribe();
    document.querySelector("fieldset").disabled = true;
    showGameOver();
  }

  function unSubscribe() {
    subscriptions.forEach((s) => s.unsubscribe());
  }

  subscriptions.push(
    wordSubscription,
    inputSubscription,
    wordsSubscription,
    lifeSubscription
  );
}

function showGameOver() {
  // document.querySelector(".game-over__panel").classList.remove("play");
}
