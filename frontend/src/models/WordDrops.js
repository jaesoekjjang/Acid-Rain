import { BehaviorSubject } from "rxjs";

export function WordDrops() {
  this._drops = new BehaviorSubject({});
}

WordDrops.prototype.add = function (key, value) {
  this._drops.next({ ...this._drops.getValue(), [key]: value });
  return this;
};

WordDrops.prototype.remove = function (key) {
  const newValue = { ...this._drops.getValue() };
  delete newValue[key];
  this._drops.next(newValue);
  return this;
};

WordDrops.prototype.has = function (key) {
  const oldValue = this._drops.getValue();
  if (oldValue.hasOwnProperty(key)) return true;

  return false;
};

WordDrops.prototype.hit = function (key) {
  if (!this.has(key)) return 0;

  const wordDrop = this._drops.getValue()[key];
  const score = wordDrop.hit();
  this.remove(key);

  return score;
};

WordDrops.prototype.pause = function (time) {
  Object.values(this._drops.getValue()).forEach((d) => d.pause(time));
};

WordDrops.prototype.resume = function (time) {
  Object.values(this._drops.getValue()).forEach((d) => d.resume(time));
};

WordDrops.prototype.draw = function (ctx) {
  Object.values(this._drops.getValue()).forEach((d) => {
    d.draw(ctx);
  });
};

WordDrops.prototype.update = function (life) {
  Object.values(this._drops.getValue()).forEach((w) => {
    w.update();
    if (w.isAlive()) return;

    this.remove(w.text);
    life.decrease();
  });
};

WordDrops.prototype.clear = function () {
  this._drops.next({});
};
