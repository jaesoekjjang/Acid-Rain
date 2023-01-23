import {
  fromEvent,
  BehaviorSubject,
  tap,
  interval,
  map,
  timer,
  take,
} from "rxjs";

export function Game({ $canvas, $form, $life }) {
  this.canvas = $canvas;
  $canvas.width = document.body.clientWidth;
  $canvas.height = document.body.clientHeight;
  this.ctx = $canvas.getContext("2d");

  this.$form = $form;
  this.$life = $life;

  this.animation;
  this.words = {};

  this.subscriptions;

  // difficultyMap: {[difficulty]: [interval, minSpeed, maxLife]}
  Game.prototype.init = function (words, difficultyMap) {
    this.wordsList = words;
    this.difficultyMap = difficultyMap || {
      1: [3000, 1, 3],
      2: [2000, 2, 3],
      3: [1500, 2.5, 3],
      4: [1000, 3, 2],
      5: [800, 5, 1],
    };
    this.ctx.font = "1rem Verdana";
  };

  Game.prototype.start = function (difficulty = 2) {
    this.wordsList.sort(() => Math.random() - 0.5);
    const [INTERVAL, MIN_SPEED, MAX_LIFE] = this.difficultyMap[difficulty];
    const words$ = new BehaviorSubject({});
    const life$ = new BehaviorSubject(MAX_LIFE);
    const subscriptions = [];

    words$.subscribe(() => (this.words = words$.getValue()));

    const interval$ = interval(INTERVAL).pipe(
      map((n) => ({ n, word: this.wordsList[n] })),
      tap(({ n, word }) => {
        //TODO x좌표: 0 ~ 화면너비-글자길이
        words$.next({
          ...words$.getValue(),
          [word]: new WordDrop({
            word,
            speed: this.speed(MIN_SPEED, n),
            x: Math.random() * this.canvas.width - word.length * 16,
          }),
        });
      })
    );

    const submit$ = fromEvent($form, "submit").pipe(
      tap((e) => e.preventDefault()),
      map((e) => e?.target?.querySelector(".input")),
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

    const intervalSubscription = interval$.subscribe();
    const submitSubscription = submit$.subscribe();
    const lifeSubscription = life$.subscribe((life) => {
      $life.innerHTML = "❤️".repeat(life);
      if (life <= 0) {
        gameOver();
        return;
      }
    });

    subscriptions.push(
      intervalSubscription,
      submitSubscription,
      lifeSubscription
    );

    this.render();
  };

  Game.prototype.speed = function (minSpeed, n) {
    const speed = minSpeed * 1.02 ** n;
    console.log(speed);
    return speed > 50 ? 50 : speed;
  };

  Game.prototype.render = function () {
    const loop = () => {
      this.ctx.clearRect(
        0,
        0,
        this.canvas.clientWidth,
        this.canvas.clientHeight
      );

      Object.values(this.words).forEach((obj) => obj.draw(this.ctx));
      Object.values(this.words).forEach((obj) => obj.update());

      this.animation = requestAnimationFrame(loop);
    };

    loop();
  };

  Game.prototype.end = function () {
    this.subscriptions;
    cancelAnimationFrame(this.animation);
  };
}

function WordDrop({ word, speed, x }) {
  this.word = word;
  this.speed = speed;
  this.x = x;
  this.y = 0;

  WordDrop.prototype.update = function () {
    this.y += this.speed;
    if (this.y >= 0) return;
  };

  WordDrop.prototype.draw = function (context) {
    context.fillText(this.word, this.x, this.y);
  };
}
