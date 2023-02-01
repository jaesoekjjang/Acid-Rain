export function WordDrop(text) {
  this.text = text;
  this.speed = WordDrop.speed(WordDrop.count);
  this.x = WordDrop.x(text.length);
  this.y = 0;
  this.fillStyle = "white";
}

WordDrop.count = 0;

WordDrop.init = function ({ canvas, game, minSpeed, maxSpeed, fontSize }) {
  WordDrop.canvas = canvas;
  WordDrop.game = game;
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
  console.log(Math.random() * (canvas.width - textLength * fontSize));
  return Math.random() * (canvas.width - textLength * fontSize);
};

WordDrop.prototype.hit = function () {
  this.skill();
  return Math.ceil(this.getScore());
};

WordDrop.prototype.skill = function () {};

WordDrop.prototype.getScore = function () {
  return (
    ((WordDrop.minSpeed + WordDrop.maxSpeed) / 2) * 20 +
    this.text.length * 15 +
    15 * 1.1 ** WordDrop.count
  );
};

WordDrop.prototype.stop = function (time = 3000) {
  const ogSpeed = this.speed;
  this.speed = 0;
  setTimeout(() => (this.speed = ogSpeed), time);
  return;
};

WordDrop.prototype.draw = function (ctx) {
  ctx.save();
  ctx.fillStyle = this.fillStyle;
  ctx.fillText(this.text, this.x, this.y);
  ctx.restore();

  // ctx.fillStyle = this.fillStyle;
  // ctx.fillRect(
  //   this.x,
  //   this.y,
  //   WordDrop.fontSize * this.text.length + 10,
  //   WordDrop.fontSize
  // );
  // ctx.fillStyle = "white";
  // console.log(WordDrop.fontSize);
  // ctx.fillText(
  //   this.text,
  //   this.x + (WordDrop.fontSize * this.text.length) / 2,
  //   this.y + WordDrop.fontSize
  // );
};

WordDrop.prototype.update = function (canvas, words$, life$) {
  this.y += this.speed;
  if (this.y <= canvas.height + WordDrop.fontSize) return;

  const words = words$.getValue();
  const copy = { ...words };
  delete copy[this.text];
  words$.next(copy);
  life$.sub();
};

export class GoldenWordDrop extends WordDrop {
  fillStyle = "#ffaf24";

  skill() {
    const { life$ } = WordDrop.game;

    life$.add();
  }
}

export class BlueWordDrop extends WordDrop {
  fillStyle = "#097cfb";

  skill() {
    const { words } = WordDrop.game;
    words.stop(3000);
  }
}

WordDrop.COMMON = "common";
WordDrop.GOLD = "gold";
WordDrop.BLUE = "blue";
