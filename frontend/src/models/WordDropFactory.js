import { BlueWordDrop, GoldenWordDrop, WordDrop } from "./WordDrop";

export class WordDropFactory {
  constructor() {}

  random() {
    const rand = Math.random();
    if (rand < 0.85) return WordDrop.COMMON;
    if (rand < 0.95) return WordDrop.BLUE;
    if (rand <= 1) return WordDrop.GOLD;
  }

  create(type, text) {
    // if(Factory creatable)
    if (type === WordDrop.COMMON) return new WordDrop(text);
    if (type === WordDrop.BLUE) return new BlueWordDrop(text);
    if (type === WordDrop.GOLD) return new GoldenWordDrop(text);
  }

  randomCreate(text) {
    return this.create(this.random(), text);
  }
}
