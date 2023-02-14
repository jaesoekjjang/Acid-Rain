import { BehaviorSubject } from "rxjs";

export class Life {
  constructor(maxLife = 3) {
    this.maxLife = maxLife;
    this._life = new BehaviorSubject(maxLife);
  }

  increase(n = 1) {
    const value = this.get();
    if (value < this.maxLife) {
      this._life.next(this._life.getValue() + n);
    }

    return this._life.getValue();
  }

  decrease(n = 1) {
    const value = this.get();
    if (value > 0) {
      this._life.next(this._life.getValue() - n);
    }

    return this._life.getValue();
  }

  reset() {
    this._life.next(this.maxLife);
  }

  get() {
    return this._life.getValue();
  }

  subscribe(cb) {
    return this._life.subscribe(cb);
  }

  complete() {
    return this._life.complete();
  }
}
