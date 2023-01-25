export function WordDrop({ text, speed, x }) {
  this.text = text;
  this.speed = speed;
  this.x = x;
  this.y = 0;
}

WordDrop.speed = function (minSpeed, maxSpeed, n) {
  const speed = Math.random() + minSpeed * 1.02 ** n;
  return speed > maxSpeed ? maxSpeed : speed;
};

WordDrop.prototype.draw = function (ctx) {
  ctx.fillText(this.text, this.x, this.y);
};

WordDrop.prototype.update = function (canvas, words$, life$) {
  this.y += this.speed;

  if (this.y <= canvas.height) return;

  const words = words$.getValue();
  const copy = { ...words };
  delete copy[this.text];
  words$.next(copy);

  life$.next(life$.getValue() - 1);
};
