import { BlueWordDrop, GoldenWordDrop, WordDrop } from "./WordDrop";
import { interval, map } from "rxjs";

export class WordDropManager {
  count = 0;
  minSpeed;
  maxSpeed;
  interval$;

  static difficultyMap = {
    1: [3000, 1, 6],
    2: [2000, 2, 7.5],
    3: [1500, 2.5, 9],
    4: [1000, 3, 10],
    5: [800, 5, 12],
  };

  constructor({ canvas, game, wordList, fontSize, difficulty }) {
    this.canvas = canvas;
    this.game = game;
    this.wordList = wordList;

    const [INTERVAL, MIN_SPEED, MAX_SPEED] =
      WordDropManager.difficultyMap[difficulty];

    WordDrop.init({ minSpeed: MIN_SPEED, maxSpeed: MAX_SPEED, fontSize });

    this.interval$ = interval(INTERVAL).pipe(
      map((n) => this.wordList[n]),
      map((text) => this.randomCreate(text))
    );
  }

  startInterval(cb) {
    this.interval$.subscribe(cb);
  }

  stopInterval() {
    this.interval$.unsubscribe();
  }

  randomCreate(text) {
    const rand = Math.random();
    const init = {
      text,
      canvas: this.canvas,
      game: this.game,
      count: this.count++,
    };

    if (rand < 0.9) return new WordDrop(init);
    if (rand < 0.97) return new BlueWordDrop(init);
    if (rand <= 1) return new GoldenWordDrop(init);
  }
}
