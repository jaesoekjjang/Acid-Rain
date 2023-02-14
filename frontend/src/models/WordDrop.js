import {
  delay,
  exhaustMap,
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
  this.maxSpeed = 6.5;
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

WordDrop.prototype.freeze = function (time = 3000) {
  clearTimeout(this.pauseTimer);
  const ogSpeed = this.speed;
  this.speed = 0;
  this.pauseTimer = setTimeout(() => (this.speed = ogSpeed), time);
  return;
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
    // words.freeze(3000);
    // pause$.next(true);

    // pause$
    //   .pipe(
    //     mergeMap(() => timer(3000)),
    //     take(1)
    //   )
    //   .subscribe((paused) => {
    //     if (!paused) {
    //       pause$.next(false);
    //     }
    //   });
    const { words, pause$ } = this.game;
    pause$.pipe(switchMap(() => timer(WordDrop.PAUSE_TIME))).subscribe(() => {
      pause$.next(false);
    });

    words.freeze(WordDrop.PAUSE_TIME);
    pause$.next(true);
  }
}

WordDrop.COMMON = "common";
WordDrop.GOLD = "gold";
WordDrop.BLUE = "blue";

WordDrop.PAUSE_TIME = 1500;
