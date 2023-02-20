import {
  fromEvent,
  BehaviorSubject,
  tap,
  map,
  scan,
  withLatestFrom,
  animationFrames,
  combineLatestWith,
  repeat,
  timer,
  Subject,
  share,
} from "rxjs";
import { Life } from "./models/Life";
import { BlueWordDrop, GoldenWordDrop, WordDrop } from "./models/WordDrop";
import { WordDrops } from "./models/WordDrops";
import { pausable, randomBetween } from "./utils";

const hitEffect = new Audio("/enter-effect.wav");
hitEffect.volume = 0.5;

Game.getInstance = function (textList, $canvas, $form) {
  if (!Game._instance) {
    const game = new Game(textList, $canvas, $form);
    Game._instance = game;
    return game;
  } else {
    return Game._instance;
  }
};

export default function Game(textList, $canvas, $form) {
  this.textList = textList;
  this.subscriptions = [];

  this.$canvas = $canvas;
  this.ctx = $canvas.getContext("2d");
  this.ctx.font = "20px Verdana";

  this.$form = $form;

  this.score$ = new BehaviorSubject(0);
  this.life$ = new Life();
  this.life$.subscribe((life) => life || this.over());

  this.words = new WordDrops();

  this.hitEffect = hitEffect;

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
  this.ctx.clearRect(0, 0, this.$canvas.clientWidth, this.$canvas.clientHeight);
  this.textList.sort(() => Math.random() - 0.5);
  this.life$.reset();
  this.score$.next(0);

  const pause$ = new Subject();
  const interval$ = timer(randomBetween(700, 1800)).pipe(
    repeat(),
    scan((prev) => prev + 1, 0),
    share(),
    pausable(pause$)
  );

  const words$ = interval$.pipe(
    map((n) => ({
      $canvas: this.$canvas,
      text: this.textList[n],
      count: n,
      hitEffect: this.hitEffect,
    })),
    scan((words, data) => {
      const rand = Math.random();
      let newWord;

      if (rand < 0.5) {
        newWord = new WordDrop(data);
      } else if (rand < 0.98) {
        newWord = new BlueWordDrop({ words, pause$, ...data });
      } else if (rand < 1) {
        newWord = new GoldenWordDrop({ life$: this.life$, ...data });
      }

      return words.add(newWord.text, newWord);
    }, new WordDrops())
  );

  const submitEvent$ = fromEvent(this.$form, "submit");

  const wordsHit$ = submitEvent$.pipe(
    tap((e) => e.preventDefault()),
    map((e) => e?.target?.querySelector(".input").value),
    withLatestFrom(words$),
    map(([input, words]) => words.hit(input)),
    tap((score) => {
      this.score$.next(this.score$.getValue() + score);
      this.$form.reset();
    })
  );
  const wordsHitSubscription = wordsHit$.subscribe();

  const render$ = animationFrames().pipe(combineLatestWith(words$));
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

  this.subscriptions.push(wordsHitSubscription, renderSubscription);

  this._onGameStart && this._onGameStart();
};

Game.prototype.over = function () {
  this.words.clear();
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
  this.pause$.complete();
  this.subscriptions.forEach((sub) => sub.unsubscribe());
  Game._instance = null;
};
