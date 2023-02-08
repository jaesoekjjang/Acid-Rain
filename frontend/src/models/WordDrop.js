export function WordDrop({ $canvas, game, text, count }) {
  this.$canvas = $canvas;
  this.ctx = $canvas.getContext("2d");
  // this.game = game;

  this.text = text;
  this.count = count;
  this.speed = 3;
  this.x = WordDrop.x({
    $canvas,
    fontSize: 20,
    textLength: text.length,
  });
  this.y = 0;
  this.color = "white";

  this.minSpeed = 30;
  this.maxSpeed = 40;
  this.fontSize = 20;
}

WordDrop.prototype.calcSpeed = function (n) {
  const { minSpeed, maxSpeed } = this;
  console.log(n, minSpeed, maxSpeed);
  const speed = Math.random() + minSpeed * 1.02 ** n;
  return speed > maxSpeed ? maxSpeed : speed;
};

WordDrop.x = function ({ $canvas, fontSize, textLength }) {
  return Math.random() * ($canvas.width - textLength * fontSize);
};

WordDrop.prototype.hit = function () {
  this.skill();
  return Math.ceil(this.getScore());
};

WordDrop.prototype.skill = function () {};

WordDrop.prototype.getScore = function () {
  return (
    ((this.minSpeed + this.maxSpeed) / 2) * 40 +
    this.text.length * 20 +
    20 * 1.1 ** this.count
  );
};

WordDrop.prototype.stop = function (time = 3000) {
  const ogSpeed = this.speed;
  this.speed = 0;
  setTimeout(() => (this.speed = ogSpeed), time);
  return;
};

WordDrop.prototype.draw = function () {
  this.ctx.save();
  this.ctx.fillStyle = this.color;
  this.ctx.fillText(this.text, this.x, this.y);
  this.ctx.restore();
};

WordDrop.prototype.update = function () {
  this.y += this.speed;
};

WordDrop.prototype.isAlive = function () {
  if (this.y <= this.$canvas.height + this.fontSize) return true;
  return false;
};

export class GoldenWordDrop extends WordDrop {
  color = "#ffaf24";

  skill() {
    // const { life$ } = this.game;
    // life$.add();
  }
}

export class BlueWordDrop extends WordDrop {
  color = "#097cfb";

  skill() {
    // const { words } = this.game;
    // words.stop(3000);
  }
}

WordDrop.COMMON = "common";
WordDrop.GOLD = "gold";
WordDrop.BLUE = "blue";
