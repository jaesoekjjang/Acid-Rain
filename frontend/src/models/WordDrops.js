export function WordDrops() {
  this.drops = new Map();
}

WordDrops.prototype.add = function (text, drop) {
  this.drops.set(text, drop);
  return this;
};

WordDrops.prototype.remove = function (text) {
  this.drops.delete(text);
  return this;
};

WordDrops.prototype.hit = function (input) {
  if (!this.drops.has(input)) return 0;

  const drop = this.drops.get(input);
  const score = drop.hit();
  this.drops.delete(input);

  return score;
};

WordDrops.prototype.pause = function () {
  this.drops.forEach((drop) => drop.pause());
};

WordDrops.prototype.resume = function () {
  this.drops.forEach((drop) => drop.resume());
};

WordDrops.prototype.draw = function (ctx) {
  this.drops.forEach((drop) => {
    drop.draw(ctx);
  });
};

WordDrops.prototype.update = function (life) {
  this.drops.forEach((drop) => {
    drop.update();
    if (drop.isAlive()) return;

    this.drops.delete(drop.text);
    life.decrease();
  });
};

WordDrops.prototype.clear = function () {
  this.drops.clear();
};
