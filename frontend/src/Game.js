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
} from "rxjs";
import { BlueWordDrop, GoldenWordDrop, WordDrop } from "./models/WordDrop";
import { WordDrops } from "./models/WordDrops";

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

const enterEffect = new Audio("/enter-effect.wav");

export default function Game(wordList, $canvas, $form) {
  this.wordList = wordList;
  this.subscriptions = [];

  this.$canvas = $canvas;
  this.ctx = $canvas.getContext("2d");
  this.ctx.font = "20px Verdana";

  this.$form = $form;

  this.life$ = new BehaviorSubject(3);
  this.score$ = new BehaviorSubject(0);

  this.life$.subscribe((life) => life || this.over());

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
  this.life$.next(3);
  this.score$.next(0);

  const interval$ = timer(randomInterval(800, 1400)).pipe(
    repeat(),
    scan((prev) => prev + 1, 0)
  );

  const words$ = interval$.pipe(
    map((n) => ({
      text: this.wordList[n],
      $canvas: this.$canvas,
      count: n,
    })),
    map((data) => {
      const rand = Math.random();
      return new WordDrop(data);
      // if (rand < 0.3) return new WordDrop(data);
      // if (rand < 0.6) return new BlueWordDrop(data);
      // if (rand <= 1) return new GoldenWordDrop(data);
    }),
    startWith(new WordDrops()),
    scan((words, newWord) => {
      words.add(newWord.text, newWord);
      return words;
    })
  );

  const submitEvent$ = fromEvent(this.$form, "submit");

  const wordsHit$ = submitEvent$.pipe(
    tap((e) => e.preventDefault()),
    map((e) => e?.target?.querySelector(".input").value),
    withLatestFrom(words$),
    map(([input, words]) => words.hit(input)),
    tap((score) => {
      score && enterEffect.play();
      this.score$.next(this.score$.getValue() + score);
      this.$form.reset();
    })
  );

  const render$ = animationFrames().pipe(combineLatestWith(words$));

  const wordSubscription = words$.subscribe();
  const wordHitscription = wordsHit$.subscribe();
  const renderSubscription = render$.subscribe(([_, words]) => {
    this.ctx.clearRect(
      0,
      0,
      this.$canvas.clientWidth,
      this.$canvas.clientHeight
    );
    words.draw(this.ctx);
    words.update(this.life$);
  });

  this.subscriptions.push(
    wordSubscription,
    wordHitscription,
    renderSubscription
  );

  this._onGameStart && this._onGameStart();
};

Game.prototype.over = function () {
  this.subscriptions.forEach((sub) => sub.unsubscribe());
  this._onGameOver && this._onGameOver();
};

Game.prototype.getLifeStream = function () {
  return this.life$;
};

Game.prototype.getScoreStream = function () {
  return this.score$;
};

Game.prototype.destroy = function () {
  this.life$.complete();
  this.score$.complete();
  this.subscriptions.forEach((sub) => sub.unsubscribe());
  Game._instance = null;
};

function GamePreview() {}
