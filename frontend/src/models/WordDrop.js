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

export function WordDrop({ $canvas, text, count, hitEffect }) {
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
  this.ogSpeed = WordDrop.speed(count);
  this.crntSpeed = this.ogSpeed;

  this.color = "white";
  this.fontSize = 20;

  this.hitEffect = hitEffect;
}

WordDrop.speed = function (count) {
  const speed = Math.random() + WordDrop.MIN_SPEED * 1.02 ** count;
  return speed > WordDrop.maxSpeed ? WordDrop.maxSpeed : speed;
};

WordDrop.x = function ({ $canvas, fontSize, textLength }) {
  return Math.random() * ($canvas.width - textLength * fontSize);
};

WordDrop.prototype.hit = function () {
  this.skill();
  this.hitEffect.play();
  return Math.ceil(this.getScore());
};

WordDrop.prototype.skill = function () {};

WordDrop.prototype.getScore = function () {
  return this.ogSpeed * 40 + this.text.length * 20 + 20 * 1.1 ** this.count;
};

WordDrop.prototype.pause = function () {
  this.crntSpeed = 0;
  return;
};

WordDrop.prototype.resume = function () {
  this.crntSpeed = this.ogSpeed;
};

WordDrop.prototype.draw = function () {
  this.ctx.save();
  this.ctx.fillStyle = this.color;
  this.ctx.fillText(this.text, this.x, this.y);
  this.ctx.restore();
};

WordDrop.prototype.update = function () {
  this.y += this.crntSpeed;
};

WordDrop.prototype.isAlive = function () {
  if (this.y <= this.$canvas.height + this.fontSize) return true;
  return false;
};

export class GoldenWordDrop extends WordDrop {
  color = "#ffaf24";

  constructor({ life$, ...props }) {
    super(props);
    this.life$ = life$;
  }

  skill() {
    this.life$.increase();
  }
}

export class BlueWordDrop extends WordDrop {
  color = "#097cfb";

  constructor({ words, pause$, ...props }) {
    super(props);
    this.words = words;
    this.pause$ = pause$;
  }

  skill() {
    const timer$ = this.pause$.pipe(
      filter((val) => val),
      switchMap(() => timer(WordDrop.PAUSE_TIME))
    );

    const subscription = timer$.subscribe(() => {
      this.words.resume();
      this.pause$.next(false);
      subscription.unsubscribe();
    });

    this.words.pause();
    this.pause$.next(true);
  }
}

WordDrop.MIN_SPEED = 2.5;
WordDrop.MAX_SPEED = 6.5;

WordDrop.COMMON = "common";
WordDrop.GOLD = "gold";
WordDrop.BLUE = "blue";

WordDrop.PAUSE_TIME = 1500;
