import { BehaviorSubject } from "rxjs";

export function WordDrops() {
  this._drops = new BehaviorSubject({});
}

WordDrops.prototype.add = function (key, value) {
  this._drops.next({ ...this._drops.getValue(), [key]: value });
};

WordDrops.prototype.remove = function (key) {
  const oldValue = this._drops.getValue();
  if (!oldValue.hasOwnProperty(key)) return;

  const newValue = { ...oldValue };
  delete newValue[key];
  this._drops.next(newValue);
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
};
