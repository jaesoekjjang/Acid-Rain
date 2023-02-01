import { fromEvent, BehaviorSubject, tap, interval, map } from "rxjs";
import { WordDrop } from "./WordDrop";
import { WordDrops } from "./WordDrops";
import { Life } from "./Life";
import { WordDropFactory } from "./WordDropFactory";

export function Game({ $canvas, $form, $life }) {
  if (new.target) {
    if (Game._instance === null) {
      Game._instance = this;
    } else {
      throw new Error("둘 이상의 Game 인스턴스를 생성할 수 없습니다.");
    }
  }

  this.canvas = $canvas;
  $canvas.width = document.body.clientWidth;
  $canvas.height = document.body.clientHeight;
  this.ctx = $canvas.getContext("2d");

  this.onGameStart;
  this.onGameOver;

  this.animation;
  this.animationPlaying = false;

  // [interval, minSpeed, maxSpeed]
  this.difficultyMap = {
    1: [3000, 1, 6],
    2: [2000, 2, 7.5],
    3: [1500, 2.5, 9],
    4: [1000, 3, 10],
    5: [800, 5, 12],
  };

  this.$form = $form;
  this.$life = $life;

  this.life$ = new Life(3);
  this.score$ = new BehaviorSubject(0);
  this.wordFacotry = new WordDropFactory();
  this.words = new WordDrops();

  this.interval$;
  this.submit$;

  this.subscriptions = [];

  Game.prototype.init = function ({
    wordList,
    fontSize = 20,
    onGameStart,
    onGameOver,
  }) {
    this.wordList = wordList;
    this.ctx.font = `${fontSize}px Verdana`;

    this.onGameStart = onGameStart;
    this.onGameOver = onGameOver;
  };

  Game.prototype.setDifficulty = function (difficulty = 3) {
    const [INTERVAL, minSpeed, maxSpeed] = this.difficultyMap[difficulty];

    //? Game이 가져야할 책임이 맞는가??
    this.interval$ = interval(INTERVAL).pipe(
      map((n) => this.wordList[n]),
      tap((text) => this.words.add(text, this.wordFacotry.randomCreate(text)))
    );

    this.submit$ = fromEvent($form, "submit").pipe(
      tap((e) => e.preventDefault()),
      map((e) => e?.target?.querySelector(".input")),
      tap(({ value: text }) => {
        this.score$.next(this.score$.getValue() + this.words.hit(text));
        $form.reset();
      })
    );

    WordDrop.init({
      canvas: this.canvas,
      game: this,
      minSpeed,
      maxSpeed,
      fontSize: 20,
    });
  };

  Game.prototype.start = function () {
    this.onGameStart();
    this.wordList.sort(() => Math.random() - 0.5);

    this.life$.reset();
    this.score$.next(0);

    const intervalSubscription = this.interval$.subscribe();
    const submitSubscription = this.submit$.subscribe();

    // TODO 의존성을 낮출 수 있는 더 좋은 구조 생각하기
    const lifeSubscription = this.life$.onChange((life) => {
      $life.innerHTML = "❤️".repeat(life);
      if (life <= 0) {
        this.gameOver();
        return;
      }
    });
    const scoreSubscription = this.score$.subscribe((score) => {
      document.querySelector(".score").innerHTML = score;
    });

    this.subscriptions.push(
      intervalSubscription,
      submitSubscription,
      lifeSubscription,
      scoreSubscription
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
  this.onGameOver();
};

Game.prototype.end = function () {
  this.animationPlaying = false;
  cancelAnimationFrame(this.animation);
  this.subscriptions.forEach((s) => s.unsubscribe());
  this.words.clear();
};

Game.prototype.restart = function () {
  this.start();
};

Game.prototype.destroy = function () {
  this.end();
  Game._instance = null;
};

Game.prototype.getScore = function () {
  return this.score$.getValue();
};
