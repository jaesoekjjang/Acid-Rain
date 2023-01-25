import { fromEvent, BehaviorSubject, tap, interval, map } from "rxjs";
import { WordDrops } from "./WordDrops";
import { WordDrop } from "./WordDrop";

export function Game({ $canvas, $form, $life }) {
  if (new.target) {
    if (Game._instance === null) {
      Game._instance = this;
    } else {
      throw new TypeError("둘 이상의 Game 인스턴스를 생성할 수 없습니다.");
    }
  }

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
  this.interval$;
  this.submit$;

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
    this.words = new WordDrops();
    this.life$ = new BehaviorSubject(MAX_LIFE);

    const interval$ = interval(INTERVAL).pipe(
      map((n) => ({ n, text: this.wordsList[n] })),
      tap(({ n, text }) => {
        //TODO x좌표의 16을 변수로 바꾸기
        this.words.add(
          text,
          new WordDrop({
            text,
            speed: WordDrop.speed(MIN_SPEED, MAX_SPEED, n),
            x: Math.random() * (this.canvas.width - text.length * 16),
          })
        );
      })
    );

    const submit$ = fromEvent($form, "submit").pipe(
      tap((e) => e.preventDefault()),
      map((e) => e?.target?.querySelector(".input")),
      tap((x) => {
        const { value: text } = x;
        this.words.remove(text);
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

  Game.prototype.render = function () {
    const loop = () => {
      if (!this.animationPlaying) return;
      this.ctx.clearRect(
        0,
        0,
        this.canvas.clientWidth,
        this.canvas.clientHeight
      );

      this.words.draw(this.ctx);
      this.words.update(this.canvas, this.life$);

      this.animation = requestAnimationFrame(loop);
    };

    this.animation = requestAnimationFrame(loop);
  };
}

Game._instance = null;

Game.getInstance = function () {
  if (Game._instance === null) {
    Game._instance = new Game();
  }
  return Game._instance;
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
