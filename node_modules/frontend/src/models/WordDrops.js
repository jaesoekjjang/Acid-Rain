import { BehaviorSubject } from "rxjs";
import { WordDrop } from "./WordDrop";

export function WordDrops() {
  this._drops = new BehaviorSubject({});
}

WordDrops.prototype.add = function (key, value) {
  this._drops.next({ ...this._drops.getValue(), [key]: value });
  WordDrop.count += 1;
};

WordDrops.prototype.remove = function (key) {
  const newValue = { ...this._drops.getValue() };
  delete newValue[key];
  this._drops.next(newValue);
};

WordDrops.prototype.has = function (key) {
  const oldValue = this._drops.getValue();
  if (oldValue.hasOwnProperty(key)) return true;

  return false;
};

WordDrops.prototype.getScore = function (key) {
  if (!this.has(key)) return 0;

  const wordDrop = this._drops.getValue()[key];
  const score = wordDrop.getScore();
  this.remove(key);

  return Math.ceil(score);
};

WordDrops.prototype.draw = function (ctx) {
  Object.values(this._drops.getValue()).forEach((w) => w.draw(ctx));
};

WordDrops.prototype.update = function (canvas, life$) {
  Object.values(this._drops.getValue()).forEach((w) =>
    w.update(canvas, this._drops, life$)
  );
};

WordDrops.prototype.clear = function () {
  this._drops.next({});
  WordDrop.count = 0;
};
