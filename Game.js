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

  this.animation;
  this.animationPlaying = false;

  this.$form = $form;
  this.$life = $life;
  this.$input = $form.querySelector("input");

  this.words$;
  this.life$;

  this.subscriptions = [];

  // difficultyMap: {[difficulty]: [interval, minSpeed, maxSpeed, maxLife]}
  Game.prototype.init = function (words, difficultyMap) {
    this.wordsList = words;
    this.difficultyMap = difficultyMap || {
      1: [3000, 1, 6, 3],
      2: [2000, 2, 7.5, 3],
      3: [1500, 2.5, 9, 3],
      4: [1000, 3, 10, 2],
      5: [800, 5, 12, 1],
    };
    this.ctx.font = "16px Verdana";
  };

  Game.prototype.start = function (difficulty = 2) {
    this.$input.focus();

    this.wordsList.sort(() => Math.random() - 0.5);
    const [INTERVAL, MIN_SPEED, MAX_SPEED, MAX_LIFE] =
      this.difficultyMap[difficulty];
    this.words$ = new BehaviorSubject({});
    this.life$ = new BehaviorSubject(MAX_LIFE);

    // words$.subscribe(() => (this.words = words$.getValue()));

    const interval$ = interval(INTERVAL).pipe(
      map((n) => ({ n, word: this.wordsList[n] })),
      tap(({ n, word }) => {
        //TODO x좌표의 16을 변수로 바꾸기
        this.words$.next({
          ...this.words$.getValue(),
          [word]: new WordDrop({
            word,
            speed: this.speed(MIN_SPEED, MAX_SPEED, n),
            x: Math.random() * (this.canvas.width - word.length * 16),
          }),
        });
      })
    );

    const submit$ = fromEvent($form, "submit").pipe(
      tap((e) => e.preventDefault()),
      map((e) => e?.target?.querySelector(".input")),
      tap((x) => {
        const { value } = x;
        const words = this.words$.getValue();
        if (value in words) {
          const copy = { ...words };
          delete copy[value];
          this.words$.next(copy);
        }
        $form.reset();
      })
    );

    const intervalSubscription = interval$.subscribe();
    const submitSubscription = submit$.subscribe();
    const lifeSubscription = this.life$.subscribe((life) => {
      $life.innerHTML = "❤️".repeat(life);
      if (life <= 0) {
        this.gameOver();
        return;
      }
    });

    this.subscriptions.push(
      intervalSubscription,
      submitSubscription,
      lifeSubscription
    );

    this.animationPlaying = true;
    this.render();
  };

  //TODO WordDrop의 static 메소드로 변경
  Game.prototype.speed = function (minSpeed, maxSpeed, n) {
    const speed = Math.random() + minSpeed * 1.02 ** n;
    return speed > maxSpeed ? maxSpeed : speed;
  };

  Game.prototype.render = function () {
    const loop = () => {
      if (!this.animationPlaying) return;
      this.ctx.clearRect(
        0,
        0,
        this.canvas.clientWidth,
        this.canvas.clientHeight
      );
      Object.values(this.words$.getValue()).forEach((obj) =>
        obj.draw(this.ctx)
      );
      Object.values(this.words$.getValue()).forEach((obj) =>
        obj.update(this.canvas, this.words$, this.life$)
      );

      this.animation = requestAnimationFrame(loop);
    };

    this.animation = requestAnimationFrame(loop);
  };

  Game.prototype.gameOver = function () {
    this.end();
    document.querySelector(".game-over__panel").classList.remove("play");
  };

  Game.prototype.end = function () {
    this.subscriptions.forEach((s) => s.unsubscribe());
    document.querySelector("fieldset").disabled = true;
    this.animationPlaying = false;
    cancelAnimationFrame(this.animation);
  };

  Game.prototype.restart = function () {
    document.querySelector("fieldset").disabled = false;
    document.querySelector(".game-over__panel").classList.add("play");
    this.start();
  };
}

function WordDrop({ word, speed, x }) {
  this.word = word;
  this.speed = speed;
  this.x = x;
  this.y = 0;

  WordDrop.prototype.update = function (canvas, words$, life$) {
    this.y += this.speed;

    if (this.y <= canvas.height) return;

    const words = words$.getValue();
    const copy = { ...words };
    delete copy[this.word];
    words$.next(copy);

    life$.next(life$.getValue() - 1);
  };

  WordDrop.prototype.draw = function (context) {
    context.fillText(this.word, this.x, this.y);
  };
}
