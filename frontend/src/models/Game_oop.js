import { fromEvent, BehaviorSubject, tap, interval, map } from "rxjs";
import { WordDrops } from "./WordDrops";
import { Life } from "./Life";
import { WordDropManager } from "./WordDropManager";

export function Game({ $canvas, $form, $life }) {
  if (new.target) {
    if (Game._instance === null) {
      Game._instance = this;
    } else {
      throw new Error("둘 이상의 Game 인스턴스를 생성할 수 없습니다.");
    }
  }

  this.canvas = $canvas;
  this.$form = $form;
  this.$life = $life;

  this.ctx = this.canvas.getContext("2d");

  $canvas.width = document.body.clientWidth;
  $canvas.height = document.body.clientHeight;

  this.onGameStart;
  this.onGameOver;

  this.animation;
  this.animationPlaying = false;

  this.life$ = new Life(3);
  this.score$ = new BehaviorSubject(0);
  this.words = new WordDrops();

  this.interval$;
  this.submit$;

  this.subscriptions = [];

  Game.prototype.init = function ({
    wordList,
    onGameStart,
    onGameOver,
    fontSize = 20,
    fontStyle = "Verdana",
  }) {
    this.wordList = wordList;
    this.ctx.font = `${fontSize}px ${fontStyle}`;

    this.onGameStart = onGameStart;
    this.onGameOver = onGameOver;

    this.wordDropManager = new WordDropManager({
      canvas: this.canvas,
      game: this,
      wordList,
      fontSize,
      difficulty: 4,
    });
  };

  Game.prototype.setDifficulty = function (difficulty = 3) {
    this.difficulty = difficulty;
  };

  Game.prototype.start = function () {
    this.wordDropManager.startInterval((wordDrop) => {
      this.words.add(wordDrop.text, wordDrop);
    });

    this.submit$ = fromEvent(this.$form, "submit").pipe(
      tap((e) => e.preventDefault()),
      map((e) => e?.target?.querySelector(".input")),
      tap(({ value: text }) => {
        this.score$.next(this.score$.getValue() + this.words.hit(text));
        document.querySelector(".game-form").reset();
      })
    );

    this.onGameStart();
    this.wordList.sort(() => Math.random() - 0.5);

    this.life$.reset();
    this.score$.next(0);

    const submitSubscription = this.submit$.subscribe();

    // TODO 의존성을 낮출 수 있는 더 좋은 구조 생각하기
    const lifeSubscription = this.life$.onChange((life) => {
      document.querySelector(".life").innerHTML = "❤️".repeat(life);
      if (life <= 0) {
        this.gameOver();
        return;
      }
    });
    const scoreSubscription = this.score$.subscribe((score) => {
      document.querySelector(".score").innerHTML = score;
    });

    this.subscriptions.push(
      submitSubscription,
      lifeSubscription,
      scoreSubscription
    );

    this.animationPlaying = true;
    this.render();
  };

  Game.prototype.render = function () {
    this.ctx.font = `20px Verdana`;
    const loop = () => {
      if (!this.animationPlaying) return;
      this.ctx.clearRect(
        0,
        0,
        this.canvas.clientWidth,
        this.canvas.clientHeight
      );

      this.words.draw(this.ctx);
      this.words.update(this.life$);

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
