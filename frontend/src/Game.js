import {
  fromEvent,
  BehaviorSubject,
  tap,
  interval,
  map,
  scan,
  startWith,
  withLatestFrom,
  of,
  animationFrames,
  mergeMap,
  combineLatest,
  combineLatestWith,
  filter,
  repeat,
  delay,
  switchMap,
  timer,
  range,
  timeInterval,
  concatMap,
  Subject,
} from "rxjs";
import { Life } from "./models/Life";
import { BlueWordDrop, GoldenWordDrop, WordDrop } from "./models/WordDrop";
import { WordDrops } from "./models/WordDrops";
import { pausable } from "./utils";

Game.getInstance = function (wordList, $canvas, $form) {
  if (!Game._instance) {
    const game = new Game(wordList, $canvas, $form);
    Game._instance = game;
    return game;
  } else {
    return Game._instance;
  }
};

const randomInterval = (min, max) => {
  return min + Math.random() * (max - min);
};

const keyboardEffect = new Audio("/enter-effect.wav");
// keyboardEffect.muted = false;

export default function Game(wordList, $canvas, $form) {
  this.wordList = wordList;
  this.subscriptions = [];

  this.$canvas = $canvas;
  this.ctx = $canvas.getContext("2d");
  this.ctx.font = "20px Verdana";

  this.$form = $form;

  this.words = new WordDrops();

  this.score$ = new BehaviorSubject(0);
  this.life = new Life();
  this.life.subscribe((life) => life || this.over());

  this.keyboardEffect = keyboardEffect;

  this._onGameStart;
  this._onGameOver;
}

Game.prototype = {
  set onGameStart(cb) {
    this._onGameStart = cb;
  },

  set onGameOver(cb) {
    this._onGameOver = cb;
  },
};

Game.prototype.start = function () {
  this.wordList.sort(() => Math.random() - 0.5);
  this.life.reset();
  this.score$.next(0);

  this.pause$ = new Subject();

  const interval$ = timer(randomInterval(800, 1500)).pipe(
    repeat(),
    scan((prev) => prev + 1, 0),
    pausable(this.pause$)
  );

  const words$ = interval$.pipe(
    map((n) => ({
      game: this,
      $canvas: this.$canvas,
      text: this.wordList[n],
      count: n,
    })),
    map((data) => {
      const rand = Math.random();
      if (rand < 0.95) return new WordDrop(data);
      if (rand < 0.98) return new BlueWordDrop(data);
      if (rand < 1) return new GoldenWordDrop(data);
    }),
    startWith(this.words),
    scan((words, newWord) => words.add(newWord.text, newWord))
  );

  const submitEvent$ = fromEvent(this.$form, "submit");

  const wordsHit$ = submitEvent$.pipe(
    tap((e) => e.preventDefault()),
    map((e) => e?.target?.querySelector(".input").value),
    withLatestFrom(words$),
    map(([input, words]) => words.hit(input)),
    tap((score) => {
      score && keyboardEffect.play();
      this.score$.next(this.score$.getValue() + score);
      this.$form.reset();
    })
  );

  const render$ = animationFrames().pipe(combineLatestWith(words$));

  const wordsHitSubscription = wordsHit$.subscribe();
  const renderSubscription = render$.subscribe(([_, words]) => {
    this.ctx.clearRect(
      0,
      0,
      this.$canvas.clientWidth,
      this.$canvas.clientHeight
    );

    words.draw(this.ctx);
    words.update(this.life);
  });

  this.subscriptions.push(wordsHitSubscription, renderSubscription);

  this._onGameStart && this._onGameStart();
};

Game.prototype.over = function () {
  this.words.clear();
  this.subscriptions.forEach((sub) => sub.unsubscribe());
  this._onGameOver && this._onGameOver();
};

Game.prototype.getLifeStream = function () {
  return this.life;
};

Game.prototype.getScoreStream = function () {
  return this.score$;
};

Game.prototype.destroy = function () {
  this.life.complete();
  this.score$.complete();
  this.subscriptions.forEach((sub) => sub.unsubscribe());
  Game._instance = null;
};
