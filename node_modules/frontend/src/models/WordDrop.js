export function WordDrop(text) {
  this.text = text;
  this.speed = WordDrop.speed(WordDrop.count);
  this.x = WordDrop.x(text.length);
  this.y = 0;
}

WordDrop.count = 0;

WordDrop.init = function ({ canvas, minSpeed, maxSpeed, fontSize }) {
  WordDrop.canvas = canvas;
  WordDrop.minSpeed = minSpeed;
  WordDrop.maxSpeed = maxSpeed;
  WordDrop.fontSize = fontSize;
};

WordDrop.speed = function (n) {
  const { minSpeed, maxSpeed } = WordDrop;
  const speed = Math.random() + minSpeed * 1.02 ** n;
  return speed > maxSpeed ? maxSpeed : speed;
};

WordDrop.x = function (textLength) {
  const { canvas, fontSize } = WordDrop;
  return Math.random() * (canvas.width - textLength * fontSize);
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
