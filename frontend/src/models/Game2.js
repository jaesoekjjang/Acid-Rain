import {
  fromEvent,
  BehaviorSubject,
  tap,
  interval,
  map,
  scan,
  animationFrameScheduler,
  startWith,
  withLatestFrom,
  of,
  animationFrames,
  mergeMap,
  combineLatest,
  combineLatestWith,
  filter,
} from "rxjs";
import { WordDrop } from "./WordDrop";
import { WordDrops } from "./WordDrops";
import { Life } from "./Life";
import { WordDropManager } from "./WordDropManager";

const gameStart = new BehaviorSubject();
const gameOver = new BehaviorSubject();

const life = new Life(3);
const score = new BehaviorSubject(0);

const paintWords = (words) => {
  words.forEach((w) => {
    w.draw();
    w.update();
  });
};

export const game = (wordList, $canvas, state) => {
  $canvas.width = document.body.clientWidth;
  $canvas.height = document.body.clientHeight;
  const ctx = $canvas.getContext("2d");
  ctx.font = "20px Verdana";

  const life$ = new BehaviorSubject(3);
  const score$ = new BehaviorSubject(0);

  score$.subscribe(console.log);
  const words$ = interval(3000).pipe(
    map((n) => ({
      text: wordList[n],
      $canvas,
      count: n,
    })),
    map((data) => {
      const rand = Math.random();
      return new WordDrop(data);
      // if (rand < 0.9) return new WordDrop(data);
      // if (rand < 0.97) return new BlueWordDrop(data);
      // if (rand <= 1) return new GoldenWordDrop(data);
    }),
    startWith({}),
    scan((words, newWord) => {
      words[newWord.text] = newWord;
      return words;
    })
  );

  words$.subscribe();

  const $form = document.querySelector(".game-form");
  const submitEvent$ = fromEvent($form, "submit");

  const wordsHit$ = submitEvent$
    .pipe(
      tap((e) => e.preventDefault()),
      map((e) => e?.target?.querySelector(".input").value),
      withLatestFrom(words$),
      map(([input, words]) => {
        if (!words.hasOwnProperty(input)) return false;
        delete words[input];
        return true;
      }),
      tap(() => $form.reset()),
      filter((x) => x),
      tap(() => score$.next(score$.getValue() + 100))
    )
    .subscribe();

  animationFrames()
    .pipe(combineLatestWith(words$))
    .subscribe(([_, words]) => {
      ctx.clearRect(0, 0, $canvas.clientWidth, $canvas.clientHeight);
      paintWords(Object.values(words));
    });
  // const render$ = animationFrameScheduler.schedule(
  //   function (state) {
  //     this.schedule(state);
  //     ctx.clearRect(0, 0, $canvas.clientWidth, $canvas.clientHeight);
  //     words$.
  //   },
  //   0,
  //   state
  // );
};

//   this.$canvas = $canvas;
//   this.$form = $form;
//   this.ctx = this.$canvas.getContext("2d");
//   this.words = new WordDrops();
//   this.wordDropManager = new WordDropManager({
//     canvas: this.$canvas,
//     wordList,
//     fontSize: 20,
//     difficulty: 4,
//   });
// }

// Game.prototype.init = function ({ wordList, onGameStart, onGameOver }) {
//   this.wordList = wordList;
// };
