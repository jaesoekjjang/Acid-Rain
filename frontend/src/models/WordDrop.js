import {
  delay,
  distinctUntilChanged,
  exhaustMap,
  filter,
  merge,
  mergeMap,
  switchMap,
  take,
  tap,
  timeout,
  timer,
} from "rxjs";

export function WordDrop({ $canvas, game, text, count }) {
  this.game = game;
  this.$canvas = $canvas;
  this.ctx = $canvas.getContext("2d");

  this.text = text;
  this.count = count;
  this.x = WordDrop.x({
    $canvas,
    fontSize: 20,
    textLength: text.length,
  });
  this.y = 0;

  this.minSpeed = 2.5;
  this.maxSpeed = 6;
  this.speed = this.calcSpeed(count);
  this.pauseTimer;

  this.color = "white";
  this.fontSize = 20;
}

WordDrop.prototype.calcSpeed = function (n) {
  const speed = Math.random() + this.minSpeed * 1.02 ** n;
  return speed > this.maxSpeed ? this.maxSpeed : speed;
};

WordDrop.x = function ({ $canvas, fontSize, textLength }) {
  return Math.random() * ($canvas.width - textLength * fontSize);
};

WordDrop.prototype.hit = function () {
  this.skill();
  return Math.ceil(this.getScore());
};

WordDrop.prototype.skill = function () {};

WordDrop.prototype.getScore = function () {
  return (
    ((this.minSpeed + this.maxSpeed) / 2) * 40 +
    this.text.length * 20 +
    20 * 1.1 ** this.count
  );
};

WordDrop.prototype.pause = function () {
  this.speed = 0;
  return;
};

WordDrop.prototype.resume = function () {
  this.speed = this.calcSpeed(this.count);
};

WordDrop.prototype.draw = function () {
  this.ctx.save();
  this.ctx.fillStyle = this.color;
  this.ctx.fillText(this.text, this.x, this.y);
  this.ctx.restore();
};

WordDrop.prototype.update = function () {
  this.y += this.speed;
};

WordDrop.prototype.isAlive = function () {
  if (this.y <= this.$canvas.height + this.fontSize) return true;
  return false;
};

export class GoldenWordDrop extends WordDrop {
  color = "#ffaf24";

  skill() {
    const { life } = this.game;
    life.increase();
  }
}

export class BlueWordDrop extends WordDrop {
  color = "#097cfb";

  skill() {
    const { words, pause$ } = this.game;
    const timer$ = pause$.pipe(
      filter((val) => val),
      switchMap(() => timer(WordDrop.PAUSE_TIME))
    );

    const subscription = timer$.subscribe(() => {
      words.resume();
      pause$.next(false);
      subscription.unsubscribe();
    });

    words.pause();
    pause$.next(true);
  }
}

WordDrop.COMMON = "common";
WordDrop.GOLD = "gold";
WordDrop.BLUE = "blue";

WordDrop.PAUSE_TIME = 1500;
